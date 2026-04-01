"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { FileText, GripVertical, Plus, Share2, Trash2, Video } from "lucide-react";
import { toast } from "sonner";
import AdminSidebar from "@/app/components/layout/AdminSidebar";
import { adminSidebarItems } from "@/app/components/layout/AdminMainLayout";
import { getCsrfToken } from "@/lib/csrf";
import type { Product } from "../types";

type ProductDetailResponse = {
  ok: boolean;
  data?: Product;
  message?: string;
};

type Course = {
  id: number;
  title: string;
  slug?: string | null;
  description?: string | null;
  status?: string | null;
  product_id?: number | null;
  created_at?: string;
  updated_at?: string;
};

type CourseDetailResponse = {
  ok: boolean;
  data?: Course;
  message?: string;
};

type CourseModulesResponse = {
  ok: boolean;
  data?: unknown;
  message?: string;
};

type CourseLessonsResponse = {
  ok: boolean;
  data?: unknown;
  message?: string;
};

type CourseModuleMutationResponse = {
  ok: boolean;
  data?: unknown;
  message?: string;
};

type CourseLessonMutationResponse = {
  ok: boolean;
  data?: unknown;
  message?: string;
};

type AuthUser = {
  id: string;
  name: string;
  email: string;
  role: "user" | "admin";
  isActive: boolean;
};

type ApiEntity = Record<string, unknown>;

type LessonContentType = "video" | "pdf";

type ChapterPage = {
  id: string;
  title: string;
  persistedId?: number | string | null;
  modulePersistedId?: number | string | null;
  isDraft?: boolean;
  isReadyToSync?: boolean;
  contentType: LessonContentType;
  textContent: string;
  fileName: string | null;
  fileObject: File | null;

  // 🔥 NEW (hasil upload)
  contentUrl?: string | null;
  b2FileId?: string | null;
  b2FileName?: string | null;
  b2BucketId?: string | null;
};

type Chapter = {
  id: string;
  title: string;
  pages: ChapterPage[];
  persistedId?: number | string | null;
  isDraft?: boolean;
  isReadyToSync?: boolean;
};

type StoredDraftPage = Omit<ChapterPage, "fileObject"> & {
  fileObject: null;
};

type StoredDraftChapter = Omit<Chapter, "pages"> & {
  pages: StoredDraftPage[];
};

type ProductEditorDraft = {
  chapters: StoredDraftChapter[];
  selectedLessonId: string | null;
};

const FALLBACK_EMPTY_CHAPTER_MESSAGE =
  "Belum ada chapter. Tambah chapter dulu, lalu lesson/page-nya bisa kita susun di local draft.";

const FALLBACK_EMPTY_LESSON_MESSAGE =
  "Pilih lesson di sidebar, atau tambah page baru supaya form lesson bisa langsung diisi.";

const LESSON_CONTENT_TYPE_OPTIONS: Array<{
  value: LessonContentType;
  label: string;
  helper: string;
}> = [
    {
      value: "video",
      label: "Video",
      helper: "Upload file .mp4 untuk lesson berbasis video.",
    },
    {
      value: "pdf",
      label: "PDF",
      helper: "Upload file .pdf untuk lesson berbasis dokumen.",
    },
  ];

const createChapter = (index: number): Chapter => ({
  id: `chapter-${Date.now()}-${index}`,
  title: index === 1 ? "New Chapter" : `New Chapter ${index}`,
  pages: [],
  persistedId: null,
  isDraft: true,
  isReadyToSync: false,
});

const createPage = (
  chapterId: string,
  index: number,
  modulePersistedId: number | string | null = null,
): ChapterPage => ({
  id: `page-${chapterId}-${Date.now()}-${index}`,
  title: index === 1 ? "New Page" : `New Page ${index}`,
  persistedId: null,
  modulePersistedId,
  isDraft: true,
  isReadyToSync: false,
  contentType: "video",
  textContent: "",
  fileName: null,
  fileObject: null,
});

const getRecord = (value: unknown): ApiEntity | null => {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return null;
  }

  return value as ApiEntity;
};

const getString = (value: unknown) => {
  if (typeof value !== "string") {
    return null;
  }

  const trimmed = value.trim();
  return trimmed ? trimmed : null;
};

const getEntityTitle = (value: ApiEntity, fallback: string) =>
  getString(value.title) ??
  getString(value.name) ??
  getString(value.label) ??
  getString(value.module_title) ??
  getString(value.lesson_title) ??
  fallback;

const getEntityText = (value: ApiEntity) =>
  getString(value.description) ??
  getString(value.content) ??
  getString(value.body) ??
  getString(value.summary) ??
  "";

const getEntityFileName = (value: ApiEntity) =>
  getString(value.b2_file_name) ?? getString(value.file_name) ?? getString(value.filename) ?? null;

const getEntityContentUrl = (value: ApiEntity) =>
  getString(value.content_url) ?? getString(value.url) ?? null;

const getEntityB2FileId = (value: ApiEntity) =>
  getString(value.b2_file_id) ?? getString(value.file_id) ?? null;

const getEntityB2BucketId = (value: ApiEntity) =>
  getString(value.b2_bucket_id) ?? getString(value.bucket_id) ?? null;

const getLessonContentType = (value: ApiEntity): LessonContentType => {
  const raw =
    getString(value.content_type) ?? getString(value.type) ?? getString(value.lesson_type) ?? "";

  if (raw.toLowerCase().includes("pdf")) {
    return "pdf";
  }

  return "video";
};

const extractCollection = (value: unknown, keys: string[]) => {
  if (Array.isArray(value)) {
    return value;
  }

  const record = getRecord(value);
  if (!record) {
    return [];
  }

  for (const key of keys) {
    const candidate = record[key];
    if (Array.isArray(candidate)) {
      return candidate;
    }
  }

  return [];
};

const extractModules = (value: unknown): unknown[] =>
  extractCollection(value, ["modules", "items", "rows", "data"]);

const extractLessons = (value: unknown): unknown[] =>
  extractCollection(value, ["lessons", "items", "rows", "data", "pages", "children"]);

const normalizePage = (
  value: unknown,
  chapterId: string,
  modulePersistedId: number | string | null,
  index: number,
): ChapterPage => {
  const page = getRecord(value);
  if (!page) {
    return createPage(chapterId, index + 1, modulePersistedId);
  }

  const rawId = page.id;
  const persistedId =
    typeof rawId === "string" || typeof rawId === "number" ? rawId : null;

  return {
    id: persistedId ? `page-persisted-${persistedId}` : `page-${chapterId}-${index + 1}`,
    title: getEntityTitle(page, index === 0 ? "Untitled Page" : `Untitled Page ${index + 1}`),
    persistedId,
    modulePersistedId,
    isDraft: false,
    isReadyToSync: true,
    contentType: getLessonContentType(page),
    textContent: getEntityText(page),
    fileName: getEntityFileName(page),
    fileObject: null,
    contentUrl: getEntityContentUrl(page),
    b2FileId: getEntityB2FileId(page),
    b2FileName: getEntityFileName(page),
    b2BucketId: getEntityB2BucketId(page),
  };
};

const normalizeChapter = (value: unknown, index: number): Chapter => {
  const chapter = getRecord(value);
  if (!chapter) {
    return createChapter(index + 1);
  }

  const rawId = chapter.id;
  const persistedId =
    typeof rawId === "string" || typeof rawId === "number" ? rawId : null;

  return {
    id: persistedId ? `chapter-persisted-${persistedId}` : `chapter-${Date.now()}-${index}`,
    title: getEntityTitle(
      chapter,
      index === 0 ? "Untitled Chapter" : `Untitled Chapter ${index + 1}`,
    ),
    pages: [],
    persistedId,
    isDraft: false,
    isReadyToSync: true,
  };
};

const getFileAccept = (contentType: LessonContentType) =>
  contentType === "pdf" ? ".pdf,application/pdf" : ".mp4,video/mp4";

const getFileHelper = (contentType: LessonContentType) =>
  contentType === "pdf"
    ? "Yang boleh diupload sekarang hanya file PDF."
    : "Yang boleh diupload sekarang hanya file MP4.";

const getLessonTypeLabel = (contentType: LessonContentType) =>
  contentType === "pdf" ? "PDF Lesson" : "Video Lesson";

const slugifyLessonFolder = (value: string) => {
  const normalized = value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return normalized || "lesson";
};

const getDraftStorageKey = (productId: number | string) =>
  `product-editor-draft-${productId}`;

const toStoredDraftChapters = (value: Chapter[]): StoredDraftChapter[] =>
  value.map((chapter) => ({
    ...chapter,
    pages: chapter.pages.map((page) => ({
      ...page,
      fileObject: null,
    })),
  }));

export default function AdminProductDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loadingProduct, setLoadingProduct] = useState(true);
  const [product, setProduct] = useState<Product | null>(null);
  const [course, setCourse] = useState<Course | null>(null);
  const [loadingCourse, setLoadingCourse] = useState(true);
  const [loadingModules, setLoadingModules] = useState(true);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [selectedLessonId, setSelectedLessonId] = useState<string | null>(null);
  const [autoFocusChapterId, setAutoFocusChapterId] = useState<string | null>(null);
  const [savingChapterId, setSavingChapterId] = useState<string | null>(null);
  const [uploadingLessonId, setUploadingLessonId] = useState<string | null>(null);
  const [savingLessonId, setSavingLessonId] = useState<string | null>(null);
  const [didHydrateDraft, setDidHydrateDraft] = useState(false);
  const [isInactive, setIsInactive] = useState(false);

  useEffect(() => {
    const init = async () => {
      try {
        const apiBaseUrl =
          process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ?? "http://localhost:4000";

        const meResponse = await fetch(`${apiBaseUrl}/api/v1/user/me`, {
          method: "GET",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          cache: "no-store",
        });
        const meResult = (await meResponse.json()) as { ok: boolean; data?: AuthUser };
        if (!meResponse.ok || !meResult.data || meResult.data.role !== "admin") {
          throw new Error("Unauthorized");
        }

        setUser(meResult.data);
        setCheckingAuth(false);

        const id = Number(params.id);
        if (!Number.isFinite(id) || id <= 0) {
          throw new Error("ID produk tidak valid.");
        }

        const productResponse = await fetch(`${apiBaseUrl}/api/v1/products/${id}`, {
          method: "GET",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          cache: "no-store",
        });

        const productResult = (await productResponse.json()) as ProductDetailResponse;
        if (!productResponse.ok || !productResult.data) {
          throw new Error(productResult.message ?? "Produk tidak ditemukan.");
        }

        setProduct(productResult.data);

        const productCourseId = productResult.data.course_id;
        if (!productCourseId) {
          setCourse(null);
          setChapters([]);
          return;
        }

        const courseResponse = await fetch(`${apiBaseUrl}/api/v1/courses/${productCourseId}`, {
          method: "GET",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          cache: "no-store",
        });

        const courseResult = (await courseResponse.json()) as CourseDetailResponse;
        if (!courseResponse.ok || !courseResult.data) {
          throw new Error(courseResult.message ?? "Course terkait tidak ditemukan.");
        }

        setCourse(courseResult.data);

        const modulesResponse = await fetch(
          `${apiBaseUrl}/api/v1/courses/${productCourseId}/modules`,
          {
            method: "GET",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            cache: "no-store",
          },
        );

        const modulesResult = (await modulesResponse.json()) as CourseModulesResponse;
        if (!modulesResponse.ok) {
          throw new Error(modulesResult.message ?? "Gagal memuat daftar chapter.");
        }

        const normalizedModules = extractModules(modulesResult.data).map(normalizeChapter);
        const chaptersWithLessons = await Promise.all(
          normalizedModules.map(async (chapter) => {
            if (!chapter.persistedId) {
              return chapter;
            }

            try {
              const lessonsResponse = await fetch(
                `${apiBaseUrl}/api/v1/courses/${productCourseId}/modules/${chapter.persistedId}/lessons`,
                {
                  method: "GET",
                  credentials: "include",
                  headers: { "Content-Type": "application/json" },
                  cache: "no-store",
                },
              );

              const lessonsResult = (await lessonsResponse.json()) as CourseLessonsResponse;
              if (!lessonsResponse.ok) {
                throw new Error(lessonsResult.message ?? `Gagal memuat lesson untuk ${chapter.title}.`);
              }

              return {
                ...chapter,
                pages: extractLessons(lessonsResult.data).map((lesson, lessonIndex) =>
                  normalizePage(lesson, chapter.id, chapter.persistedId ?? null, lessonIndex),
                ),
              };
            } catch (error) {
              toast.error(
                error instanceof Error
                  ? error.message
                  : `Gagal memuat lesson untuk ${chapter.title}.`,
              );
              return chapter;
            }
          }),
        );

        const draftKey = getDraftStorageKey(productResult.data.id);
        const storedDraftRaw = typeof window !== "undefined" ? window.localStorage.getItem(draftKey) : null;

        if (storedDraftRaw) {
          try {
            const storedDraft = JSON.parse(storedDraftRaw) as ProductEditorDraft;
            setChapters(storedDraft.chapters.map((chapter) => ({
              ...chapter,
              pages: chapter.pages.map((page) => ({
                ...page,
                fileObject: null,
              })),
            })));
            setSelectedLessonId(storedDraft.selectedLessonId ?? null);
          } catch {
            window.localStorage.removeItem(draftKey);
            setChapters(chaptersWithLessons);
          }
        } else {
          setChapters(chaptersWithLessons);
        }

        setDidHydrateDraft(true);
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Gagal memuat detail produk.";
        toast.error(message);
        router.replace("/admin?tab=products");
      } finally {
        setLoadingProduct(false);
        setLoadingCourse(false);
        setLoadingModules(false);
      }
    };

    void init();
  }, [params.id, router]);

  useEffect(() => {
    const allPages = chapters.flatMap((chapter) => chapter.pages);
    if (!allPages.length) {
      setSelectedLessonId(null);
      return;
    }

    if (!selectedLessonId || !allPages.some((page) => page.id === selectedLessonId)) {
      setSelectedLessonId(allPages[0].id);
    }
  }, [chapters, selectedLessonId]);
  useEffect(() => {
    if (!didHydrateDraft || !product?.id) {
      return;
    }

    const draftKey = getDraftStorageKey(product.id);
    const hasDraftContent = chapters.some(
      (chapter) => chapter.isDraft || chapter.pages.some((page) => page.isDraft),
    );

    if (!hasDraftContent) {
      window.localStorage.removeItem(draftKey);
      return;
    }

    const payload: ProductEditorDraft = {
      chapters: toStoredDraftChapters(chapters),
      selectedLessonId,
    };

    window.localStorage.setItem(draftKey, JSON.stringify(payload));
  }, [chapters, didHydrateDraft, product?.id, selectedLessonId]);


  const selectedLesson = useMemo(() => {
    for (const chapter of chapters) {
      const page = chapter.pages.find((item) => item.id === selectedLessonId);
      if (page) {
        return {
          chapter,
          page,
        };
      }
    }

    return null;
  }, [chapters, selectedLessonId]);

  const handleLogout = async () => {
    try {
      const apiBaseUrl =
        process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ?? "http://localhost:4000";

      await fetch(`${apiBaseUrl}/api/v1/user/logout`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          "x-csrf-token": getCsrfToken(),
        },
      });
    } finally {
      toast.success("Kamu sudah logout.");
      router.push("/login");
    }
  };

  const handleAddChapter = () => {
    const chapterIndex =
      chapters.filter((chapter) => chapter.title.startsWith("New Chapter")).length + 1;
    const newChapter = createChapter(chapterIndex);

    setChapters((prev) => [...prev, newChapter]);
    setAutoFocusChapterId(newChapter.id);
    toast.success("Chapter baru sudah dibuat. Langsung isi judul lalu tekan Enter.");
  };

  const handleAddPage = (chapterId: string) => {
    let nextSelectedLessonId: string | null = null;

    setChapters((prev) =>
      prev.map((chapter) => {
        if (chapter.id !== chapterId) return chapter;

        const newPage = createPage(
          chapterId,
          chapter.pages.length + 1,
          chapter.persistedId ?? null,
        );
        nextSelectedLessonId = newPage.id;

        return {
          ...chapter,
          pages: [...chapter.pages, newPage],
        };
      }),
    );

    if (nextSelectedLessonId) {
      setSelectedLessonId(nextSelectedLessonId);
    }

    toast.success("Lesson baru sudah ditambahkan ke draft.");
  };

  const updateLesson = (
    lessonId: string,
    updater: (page: ChapterPage, chapter: Chapter) => ChapterPage,
  ) => {
    setChapters((prev) =>
      prev.map((chapter) => ({
        ...chapter,
        pages: chapter.pages.map((page) =>
          page.id === lessonId ? updater(page, chapter) : page,
        ),
      })),
    );
  };

  const handleDeleteChapter = (chapterId: string) => {
    setChapters((prev) => prev.filter((chapter) => chapter.id !== chapterId));
    toast.success("Chapter sudah dihapus dari draft.");
  };

  const handleDeletePage = (chapterId: string, pageId: string) => {
    setChapters((prev) =>
      prev.map((chapter) => {
        if (chapter.id !== chapterId) return chapter;

        return {
          ...chapter,
          pages: chapter.pages.filter((page) => page.id !== pageId),
        };
      }),
    );
    toast.success("Lesson sudah dihapus dari draft.");
  };

  const handleChapterTitleChange = (chapterId: string, value: string) => {
    setChapters((prev) =>
      prev.map((chapter) =>
        chapter.id === chapterId
          ? {
            ...chapter,
            title: value,
            isDraft: true,
            isReadyToSync: false,
          }
          : chapter,
      ),
    );
  };

  const handleLessonTitleChange = (value: string) => {
    if (!selectedLesson) return;
    updateLesson(selectedLesson.page.id, (page) => ({
      ...page,
      title: value,
      isDraft: true,
      isReadyToSync: false,
    }));
  };

  const handleLessonTextChange = (value: string) => {
    if (!selectedLesson) return;
    updateLesson(selectedLesson.page.id, (page) => ({
      ...page,
      textContent: value,
      isDraft: true,
      isReadyToSync: false,
    }));
  };
  const deleteLessonAssetFromStorage = async (page: ChapterPage) => {
    const courseId = course?.id ?? product?.course_id ?? null;
    const moduleId = page.modulePersistedId ?? null;

    if (!courseId || !moduleId || !page.b2FileId || !page.b2FileName) {
      return;
    }

    const apiBaseUrl =
      process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ?? "http://localhost:4000";

    const response = await fetch(
      `${apiBaseUrl}/api/v1/courses/${courseId}/modules/${moduleId}/lessons/asset`,
      {
        method: "DELETE",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          "x-csrf-token": getCsrfToken(),
        },
        body: JSON.stringify({
          content_type: page.contentType,
          file_id: page.b2FileId,
          file_name: page.b2FileName,
        }),
      },
    );

    const result = (await response.json()) as { ok?: boolean; message?: string };
    if (!response.ok) {
      throw new Error(result.message ?? "Gagal menghapus asset lama.");
    }
  };

  const handleLessonTypeChange = async (value: LessonContentType) => {
    if (!selectedLesson) return;

    const currentLesson = selectedLesson.page;
    const isChangingType = currentLesson.contentType !== value;
    const hasStoredAsset = Boolean(currentLesson.b2FileId && currentLesson.b2FileName);

    try {
      if (isChangingType && hasStoredAsset) {
        await deleteLessonAssetFromStorage(currentLesson);
      }

      updateLesson(currentLesson.id, (page) => ({
        ...page,
        contentType: value,
        fileName: null,
        fileObject: null,
        contentUrl: null,
        b2FileId: null,
        b2FileName: null,
        b2BucketId: null,
        isDraft: true,
        isReadyToSync: false,
      }));

      if (isChangingType && hasStoredAsset) {
        toast.success("Asset lama dihapus. Silakan upload file baru.");
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Gagal mengganti tipe lesson.");
    }
  };

  const handleLessonFileChange = async (file: File | null) => {
    if (!selectedLesson || !file) return;

    const currentLesson = selectedLesson.page;
    const lessonId = currentLesson.id;
    const courseId = course?.id ?? product?.course_id;
    const moduleId = currentLesson.modulePersistedId;

    if (!courseId || !moduleId) {
      toast.error("Module harus sudah tersimpan sebelum upload file.");
      return;
    }

    const apiBaseUrl =
      process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ??
      "http://localhost:4000";

    setUploadingLessonId(lessonId);

    try {
      if (currentLesson.b2FileId && currentLesson.b2FileName) {
        await deleteLessonAssetFromStorage(currentLesson);
      }

      const formData = new FormData();
      const isPdf = currentLesson.contentType === "pdf";
      const lessonFolder = slugifyLessonFolder(selectedLesson.chapter.title);

      formData.append(isPdf ? "pdf" : "video", file);
      formData.append("lesson_folder", lessonFolder);

      const endpoint = isPdf
        ? `${apiBaseUrl}/api/v1/courses/${courseId}/modules/${moduleId}/lessons/upload/pdf`
        : `${apiBaseUrl}/api/v1/courses/${courseId}/modules/${moduleId}/lessons/upload/video`;

      const res = await fetch(endpoint, {
        method: "POST",
        credentials: "include",
        headers: {
          "x-csrf-token": getCsrfToken(),
        },
        body: formData,
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.message || "Upload gagal");
      }

      const data = getRecord(result.data);

      updateLesson(lessonId, (page) => ({
        ...page,
        fileObject: file,
        fileName: file.name,
        contentUrl: data ? getEntityContentUrl(data) : null,
        b2FileId: data ? getEntityB2FileId(data) : null,
        b2FileName: data ? getEntityFileName(data) : file.name,
        b2BucketId: data ? getEntityB2BucketId(data) : null,
        isDraft: true,
        isReadyToSync: false,
      }));

      toast.success("File berhasil diupload.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Upload gagal");
    } finally {
      setUploadingLessonId(null);
    }
  };

  const handleSaveChapterDraft = async (chapterId: string) => {
    const targetChapter = chapters.find((chapter) => chapter.id === chapterId);
    const courseId = course?.id ?? product?.course_id ?? null;

    if (!targetChapter || !courseId) {
      toast.error("Course ID belum tersedia untuk menyimpan chapter.");
      return;
    }

    const title = targetChapter.title.trim() || "Untitled Chapter";
    const position = chapters.findIndex((chapter) => chapter.id === chapterId) + 1;
    const apiBaseUrl =
      process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ?? "http://localhost:4000";

    setSavingChapterId(chapterId);

    try {
      const endpoint = targetChapter.persistedId
        ? `${apiBaseUrl}/api/v1/courses/${courseId}/modules/${targetChapter.persistedId}`
        : `${apiBaseUrl}/api/v1/courses/${courseId}/modules`;
      const method = targetChapter.persistedId ? "PATCH" : "POST";

      const response = await fetch(endpoint, {
        method,
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          "x-csrf-token": getCsrfToken(),
        },
        body: JSON.stringify({
          title,
          position,
        }),
      });

      const result = (await response.json()) as CourseModuleMutationResponse;
      if (!response.ok) {
        throw new Error(result.message ?? "Gagal menyimpan chapter.");
      }

      const responseRecord = getRecord(result.data);
      const returnedId = responseRecord?.id;
      const persistedId =
        typeof returnedId === "string" || typeof returnedId === "number"
          ? returnedId
          : targetChapter.persistedId ?? null;
      const nextTitle = responseRecord ? getEntityTitle(responseRecord, title) : title;

      setChapters((prev) =>
        prev.map((chapter) =>
          chapter.id === chapterId
            ? {
              ...chapter,
              title: nextTitle,
              persistedId,
              isDraft: false,
              isReadyToSync: true,
              pages: chapter.pages.map((page) => ({
                ...page,
                modulePersistedId: persistedId ?? page.modulePersistedId ?? null,
              })),
            }
            : chapter,
        ),
      );
      setAutoFocusChapterId((current) => (current === chapterId ? null : current));
      toast.success(
        targetChapter.persistedId
          ? "Chapter berhasil diperbarui ke course module."
          : "Chapter berhasil dibuat di course module.",
      );
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Gagal menyimpan chapter.");
    } finally {
      setSavingChapterId(null);
    }
  };
  const handleSaveLessonDraft = async () => {
    if (!selectedLesson) return;

    const lesson = selectedLesson.page;
    const courseId = course?.id ?? product?.course_id ?? null;
    const moduleId = lesson.modulePersistedId ?? null;

    if (!courseId || !moduleId) {
      toast.error("Module harus sudah tersimpan sebelum save lesson.");
      return;
    }

    if (!lesson.title.trim()) {
      toast.error("Judul lesson wajib diisi.");
      return;
    }

    const apiBaseUrl =
      process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ?? "http://localhost:4000";
    const chapterIndex = chapters.findIndex((chapter) => chapter.id === selectedLesson.chapter.id);
    const lessonPosition =
      (chapters[chapterIndex]?.pages.findIndex((page) => page.id === lesson.id) ?? -1) + 1;

    setSavingLessonId(lesson.id);

    try {
      const endpoint = lesson.persistedId
        ? `${apiBaseUrl}/api/v1/courses/${courseId}/modules/${moduleId}/lessons/${lesson.persistedId}`
        : `${apiBaseUrl}/api/v1/courses/${courseId}/modules/${moduleId}/lessons`;
      const method = lesson.persistedId ? "PATCH" : "POST";

      const response = await fetch(endpoint, {
        method,
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          "x-csrf-token": getCsrfToken(),
        },
        body: JSON.stringify({
          title: lesson.title.trim(),
          description: lesson.textContent,
          content_type: lesson.contentType,
          content_url: lesson.contentUrl ?? null,
          b2_file_id: lesson.b2FileId ?? null,
          b2_file_name: lesson.b2FileName ?? lesson.fileName ?? null,
          b2_bucket_id: lesson.b2BucketId ?? null,
          position: lessonPosition > 0 ? lessonPosition : 1,
          is_preview: false,
        }),
      });

      const result = (await response.json()) as CourseLessonMutationResponse;
      if (!response.ok) {
        throw new Error(result.message ?? "Gagal menyimpan lesson.");
      }

      const responseRecord = getRecord(result.data);
      const returnedId = responseRecord?.id;
      const persistedId =
        typeof returnedId === "string" || typeof returnedId === "number"
          ? returnedId
          : lesson.persistedId ?? null;

      updateLesson(lesson.id, (page) => ({
        ...page,
        title: page.title.trim() || "Untitled Lesson",
        persistedId,
        isDraft: false,
        isReadyToSync: true,
      }));

      if (product?.id) {
        window.localStorage.removeItem(getDraftStorageKey(product.id));
      }

      toast.success(
        lesson.persistedId
          ? "Lesson berhasil diperbarui. Draft editor dibersihkan."
          : "Lesson berhasil dibuat. Draft editor dibersihkan.",
      );
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Gagal menyimpan lesson.");
    } finally {
      setSavingLessonId(null);
    }
  };
  const handleShowDraftSummary = () => {
    const draftChapterCount = chapters.filter((chapter) => chapter.isDraft).length;
    const readyChapterCount = chapters.filter((chapter) => chapter.isReadyToSync).length;
    const lessons = chapters.flatMap((chapter) => chapter.pages);
    const draftLessonCount = lessons.filter((lesson) => lesson.isDraft).length;
    const readyLessonCount = lessons.filter((lesson) => lesson.isReadyToSync).length;
    toast.success(
      `Draft lokal: ${draftChapterCount} chapter draft, ${readyChapterCount} chapter ready, ${draftLessonCount} lesson draft, ${readyLessonCount} lesson ready.`,
    );
  };

  if (checkingAuth || loadingProduct || loadingCourse || loadingModules) {
    return (
      <main className="bg-hero flex min-h-screen items-center justify-center px-6">
        <p className="text-sm text-white/70">Memuat detail produk...</p>
      </main>
    );
  }

  if (!product || !user) {
    return null;
  }

  const pageTitle = course?.title || product.title;
  const subtitle = !product.course_id
    ? "Product ini belum punya course_id, jadi sidebar chapter masih local-only sampai course dipasang."
    : `Course ID ${product.course_id} dimuat bersama module dan lesson, lalu perubahan baru ditampung dulu di local draft.`;

  return (
    <main className="bg-hero relative min-h-screen overflow-hidden px-4 py-4 md:px-6 md:py-5">
      <div className="pointer-events-none absolute -left-20 top-16 h-80 w-80 rounded-full bg-[rgba(30,174,219,0.16)] blur-[110px]" />
      <div className="pointer-events-none absolute -right-24 bottom-10 h-96 w-96 rounded-full bg-[rgba(51,195,240,0.12)] blur-[125px]" />

      <section className="relative mx-auto grid min-h-[calc(100vh-40px)] w-full max-w-[1680px] grid-cols-1 overflow-hidden rounded-2xl border border-[rgba(30,174,219,0.26)] bg-[rgba(5,12,28,0.84)] shadow-[0_0_35px_rgba(30,174,219,0.14)] md:grid-cols-[280px_minmax(0,1fr)]">
        <AdminSidebar activeTab="products" items={adminSidebarItems} user={user} onLogout={handleLogout} />

        <section className="overflow-y-auto p-4 md:p-6">
          <div className="rounded-[28px] border border-[rgba(30,174,219,0.22)] bg-[rgba(7,17,38,0.58)] text-white shadow-[0_24px_80px_rgba(9,18,35,0.24)] backdrop-blur-xl">
            <div className="border-b border-white/10 px-5 py-5 md:px-8 md:py-6">
              <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
                <div className="space-y-4">
                  <button
                    type="button"
                    onClick={() => router.push("/admin?tab=products")}
                    className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-[rgba(10,20,44,0.72)] px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:border-[rgba(30,174,219,0.45)]"
                  >
                    <span aria-hidden="true">&larr;</span>
                    Back
                  </button>

                  <div>
                    <h1 className="max-w-4xl text-3xl font-semibold leading-tight text-white md:text-5xl">
                      {pageTitle}
                    </h1>
                    <p className="mt-3 text-sm text-white/65 md:text-base">{subtitle}</p>
                  </div>
                </div>

                <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-end">
                  <label className="inline-flex items-center gap-3 rounded-full border border-white/15 bg-[rgba(10,20,44,0.72)] px-4 py-2.5 text-sm font-medium text-white shadow-sm">
                    <span
                      className={`relative h-6 w-11 rounded-full transition ${isInactive ? "bg-white/20" : "bg-[#6d43f8]"
                        }`}
                    >
                      <span
                        className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow transition ${isInactive ? "left-1" : "left-6"
                          }`}
                      />
                    </span>
                    <input
                      type="checkbox"
                      checked={isInactive}
                      onChange={(event) => setIsInactive(event.target.checked)}
                      className="sr-only"
                    />
                    <span>Set Inactive</span>
                  </label>

                  <button
                    type="button"
                    className="inline-flex items-center justify-center gap-2 rounded-full border border-white/15 bg-[rgba(10,20,44,0.72)] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:border-[rgba(30,174,219,0.45)]"
                  >
                    Share
                    <Share2 size={16} />
                  </button>

                  <button
                    type="button"
                    onClick={handleShowDraftSummary}
                    className="rounded-full bg-[#5e34f2] px-6 py-3 text-sm font-semibold text-white shadow-[0_14px_30px_rgba(94,52,242,0.28)] transition hover:brightness-110"
                  >
                    Check Draft Status
                  </button>
                </div>
              </div>
            </div>

            <div className="px-5 py-4 md:px-8 md:py-5">
              <div className="border-b border-white/10 pb-3">
                <div className="inline-flex items-center gap-2 border-b-2 border-[#1f242d] pb-3 text-lg font-semibold text-white">
                  <span className="text-base">1.</span>
                  <span>Content</span>
                </div>
              </div>

              <div className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
                <div className="space-y-6">
                  <section>
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <h2 className="text-2xl font-semibold text-white">Lesson Editor</h2>
                        <p className="mt-2 text-sm text-white/60">
                          Form ini sekarang fokus ke lesson di dalam module. Untuk sementara save dilakukan per item dulu di local draft, jadi nanti wiring ke API bisa dipasang per chapter dan per lesson dengan lebih rapi.
                        </p>
                      </div>
                      {selectedLesson ? (
                        <span className="rounded-full border border-[rgba(30,174,219,0.28)] bg-[rgba(30,174,219,0.12)] px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-[#8ee6ff]">
                          Module ID {selectedLesson.chapter.persistedId ?? "draft"}
                        </span>
                      ) : null}
                    </div>

                    {!selectedLesson ? (
                      <div className="mt-4 rounded-[24px] border border-dashed border-white/12 bg-[rgba(8,18,40,0.42)] px-5 py-8 text-sm text-white/55">
                        {FALLBACK_EMPTY_LESSON_MESSAGE}
                      </div>
                    ) : (
                      <div className="mt-4 space-y-5 rounded-[24px] border border-white/12 bg-[rgba(8,18,40,0.62)] p-5 shadow-[0_14px_30px_rgba(42,45,58,0.05)]">
                        <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_220px] lg:items-start">
                          <label className="space-y-2">
                            <span className="text-sm font-medium text-white/75">Lesson Title</span>
                            <input
                              value={selectedLesson.page.title}
                              onChange={(event) => handleLessonTitleChange(event.target.value)}
                              className="w-full rounded-[18px] border border-white/12 bg-[rgba(255,255,255,0.03)] px-4 py-3 text-base text-white outline-none transition focus:border-[rgba(30,174,219,0.48)]"
                              placeholder="Masukkan judul lesson"
                            />
                          </label>

                          <div className="rounded-[18px] border border-white/10 bg-[rgba(255,255,255,0.03)] p-4">
                            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/45">
                              Linked Module
                            </p>
                            <p className="mt-2 text-base font-semibold text-white">
                              {selectedLesson.chapter.title}
                            </p>
                            <p className="mt-1 text-sm text-white/60">
                              moduleId: {selectedLesson.page.modulePersistedId ?? "belum ada, akan dibuat saat publish"}
                            </p>
                            <p className="mt-3 text-sm text-white/55">
                              lessonId: {selectedLesson.page.persistedId ?? "draft"}
                            </p>
                          </div>
                        </div>

                        <div className="grid gap-3 md:grid-cols-2">
                          {LESSON_CONTENT_TYPE_OPTIONS.map((option) => {
                            const active = selectedLesson.page.contentType === option.value;
                            return (
                              <button
                                key={option.value}
                                type="button"
                                onClick={() => handleLessonTypeChange(option.value)}
                                className={`rounded-[20px] border px-4 py-4 text-left transition ${active
                                  ? "border-[rgba(30,174,219,0.4)] bg-[rgba(30,174,219,0.12)] shadow-[0_10px_30px_rgba(30,174,219,0.08)]"
                                  : "border-white/10 bg-[rgba(255,255,255,0.03)] hover:border-white/20"
                                  }`}
                              >
                                <div className="flex items-center gap-3 text-white">
                                  {option.value === "video" ? <Video size={18} /> : <FileText size={18} />}
                                  <span className="font-semibold">{option.label}</span>
                                </div>
                                <p className="mt-2 text-sm text-white/60">{option.helper}</p>
                              </button>
                            );
                          })}
                        </div>

                        <div className="rounded-[20px] border border-white/10 bg-[rgba(255,255,255,0.03)] p-4">
                          <div className="flex flex-wrap items-center justify-between gap-3">
                            <div>
                              <p className="text-sm font-semibold text-white">
                                {getLessonTypeLabel(selectedLesson.page.contentType)} Asset
                              </p>
                              <p className="mt-1 text-sm text-white/55">
                                {getFileHelper(selectedLesson.page.contentType)}
                              </p>
                            </div>
                            <span className="rounded-full border border-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-white/55">
                              {uploadingLessonId === selectedLesson.page.id ? "Uploading..." : selectedLesson.page.fileName ? "File selected" : "No file"}
                            </span>
                          </div>

                          <label className="mt-4 flex cursor-pointer flex-col items-center justify-center rounded-[18px] border border-dashed border-white/15 bg-[rgba(5,12,28,0.3)] px-5 py-8 text-center transition hover:border-[rgba(30,174,219,0.4)]">
                            <span className="text-sm font-semibold text-white">Choose file</span>
                            <span className="mt-2 text-sm text-white/55">
                              Accept: {selectedLesson.page.contentType === "pdf" ? ".pdf" : ".mp4"}
                            </span>
                            <input
                              key={`${selectedLesson.page.id}-${selectedLesson.page.contentType}`}
                              type="file"
                              accept={getFileAccept(selectedLesson.page.contentType)}
                              className="sr-only"
                              disabled={uploadingLessonId === selectedLesson.page.id}
                              onChange={(event) =>
                                handleLessonFileChange(event.target.files?.[0] ?? null)
                              }
                            />
                          </label>

                          <div className="mt-4 space-y-3 rounded-[16px] border border-white/10 bg-[rgba(255,255,255,0.02)] px-4 py-3 text-sm text-white/70">
                            <p>Nama file: {selectedLesson.page.fileName ?? "Belum ada file dipilih."}</p>
                            <p className="break-all">Content URL: {selectedLesson.page.contentUrl ? (<a href={selectedLesson.page.contentUrl} target="_blank" rel="noreferrer" className="text-[#8ee6ff] underline underline-offset-4 transition hover:text-white">{selectedLesson.page.contentUrl}</a>) : "Belum ada content_url tersedia."}</p>
                          </div>
                        </div>

                        <label className="space-y-2">
                          <span className="text-sm font-medium text-white/75">Lesson Content / Description</span>
                          <textarea
                            value={selectedLesson.page.textContent}
                            onChange={(event) => handleLessonTextChange(event.target.value)}
                            className="min-h-[220px] w-full rounded-[18px] border border-[#eadfce] bg-[rgba(255,255,255,0.03)] px-4 py-4 text-base text-white outline-none transition focus:border-[rgba(30,174,219,0.48)]"
                            placeholder="Tulis deskripsi atau isi lesson di sini"
                          />
                        </label>
                        <div className="flex flex-wrap items-center justify-between gap-3 rounded-[18px] border border-white/10 bg-[rgba(255,255,255,0.03)] px-4 py-4">
                          <p className="text-sm text-white/60">
                            {savingLessonId === selectedLesson.page.id
                              ? "Sedang menyimpan lesson ke backend..."
                              : selectedLesson.page.isDraft
                                ? "Lesson ini masih draft. Klik save untuk create/update lesson di backend."
                                : selectedLesson.page.isReadyToSync
                                  ? "Lesson ini sudah sinkron dengan endpoint backend."
                                  : "Lesson existing belum diubah."}
                          </p>
                          <button
                            type="button"
                            onClick={handleSaveLessonDraft}
                            disabled={savingLessonId === selectedLesson.page.id || uploadingLessonId === selectedLesson.page.id}
                            className="rounded-full bg-[#1eaedb] px-5 py-3 text-sm font-semibold text-[#07111f] transition hover:brightness-110 disabled:cursor-wait disabled:opacity-70"
                          >
                            {savingLessonId === selectedLesson.page.id ? "Saving..." : "Save Lesson"}
                          </button>
                        </div>
                      </div>
                    )}
                  </section>
                </div>

                <aside className="rounded-[24px] border border-[#e3d8c7] bg-[rgba(8,18,40,0.52)] p-4 shadow-[0_14px_30px_rgba(42,45,58,0.05)]">
                  <div className="flex flex-wrap gap-3">
                    <button
                      type="button"
                      onClick={handleAddChapter}
                      className="rounded-full border border-white/15 bg-[rgba(10,20,44,0.72)] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:border-[rgba(30,174,219,0.45)]"
                    >
                      Add Chapter
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (!chapters.length) {
                          handleAddChapter();
                          return;
                        }
                        handleAddPage(chapters[chapters.length - 1].id);
                      }}
                      className="rounded-full border border-white/15 bg-[rgba(10,20,44,0.72)] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:border-[rgba(30,174,219,0.45)]"
                    >
                      Add New Page
                    </button>
                  </div>

                  <div className="mt-4 max-h-[880px] space-y-5 overflow-y-auto pr-2 [scrollbar-color:rgba(227,216,199,0.42)_transparent] [scrollbar-width:thin] [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:border-[1.5px] [&::-webkit-scrollbar-thumb]:border-transparent [&::-webkit-scrollbar-thumb]:bg-[rgba(227,216,199,0.42)] [&::-webkit-scrollbar-thumb]:bg-clip-padding [&::-webkit-scrollbar-thumb]:transition-colors hover:[&::-webkit-scrollbar-thumb]:bg-[rgba(255,255,255,0.52)] [&::-webkit-scrollbar-track]:bg-transparent">
                    {!chapters.length ? (
                      <div className="rounded-[20px] border border-dashed border-white/15 bg-[rgba(255,255,255,0.02)] px-4 py-5 text-sm text-white/55">
                        {FALLBACK_EMPTY_CHAPTER_MESSAGE}
                      </div>
                    ) : null}

                    {chapters.map((chapter) => (
                      <div
                        key={chapter.id}
                        className="rounded-[24px] border border-white/12 bg-[rgba(8,18,40,0.62)] p-4 shadow-[0_10px_24px_rgba(42,45,58,0.04)]"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-start gap-3">
                            <GripVertical size={18} className="mt-1 text-white/35" />
                            <div>
                              <p className="text-[28px] leading-none text-white/20">.</p>
                              <div className="-mt-1 flex flex-wrap items-center gap-2">
                                <input
                                  value={chapter.title}
                                  onChange={(event) => handleChapterTitleChange(chapter.id, event.target.value)}
                                  onKeyDown={(event) => {
                                    if (event.key === "Enter") {
                                      event.preventDefault();
                                      handleSaveChapterDraft(chapter.id);
                                      event.currentTarget.blur();
                                    }
                                  }}
                                  onBlur={() => {
                                    if (autoFocusChapterId === chapter.id) {
                                      setAutoFocusChapterId(null);
                                    }
                                  }}
                                  autoFocus={autoFocusChapterId === chapter.id}
                                  disabled={savingChapterId === chapter.id}
                                  className="w-full rounded-[14px] border border-transparent bg-transparent px-0 py-0 text-2xl font-medium text-white outline-none transition focus:border-[rgba(30,174,219,0.38)] focus:bg-[rgba(255,255,255,0.03)] disabled:cursor-wait disabled:opacity-70"
                                  placeholder="Masukkan judul chapter"
                                />
                                {chapter.isDraft ? (
                                  <span className="rounded-full border border-[rgba(30,174,219,0.28)] bg-[rgba(30,174,219,0.12)] px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#8ee6ff]">
                                    Draft
                                  </span>
                                ) : chapter.isReadyToSync && !chapter.persistedId ? (
                                  <span className="rounded-full border border-[rgba(52,211,153,0.28)] bg-[rgba(52,211,153,0.12)] px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#8af0c7]">
                                    Ready
                                  </span>
                                ) : null}
                              </div>
                              <p className="mt-2 text-xs text-white/45">
                                moduleId: {chapter.persistedId ?? "draft"}
                              </p>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleDeleteChapter(chapter.id)}
                            className="rounded-full p-1 text-white/55 transition hover:bg-white/10"
                            aria-label={`Delete ${chapter.title}`}
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>

                        <div className="mt-4 space-y-3">
                          {chapter.pages.map((page) => {
                            const isSelected = page.id === selectedLessonId;
                            return (
                              <button
                                key={page.id}
                                type="button"
                                onClick={() => setSelectedLessonId(page.id)}
                                className={`block w-full rounded-[20px] border px-4 py-4 text-left transition ${isSelected
                                  ? "border-[rgba(30,174,219,0.42)] bg-[rgba(30,174,219,0.12)]"
                                  : "border-white/10 bg-[rgba(255,255,255,0.03)] hover:border-white/20"
                                  }`}
                              >
                                <div className="flex items-start justify-between gap-3">
                                  <div className="flex items-start gap-3">
                                    <GripVertical size={18} className="mt-1 text-[#5a4f43]" />
                                    <div className="space-y-2">
                                      <p className="text-lg font-medium leading-snug text-white">
                                        {page.title}
                                      </p>
                                      <div className="flex flex-wrap items-center gap-2 text-xs text-white/55">
                                        <span>{getLessonTypeLabel(page.contentType)}</span>
                                        <span>moduleId: {page.modulePersistedId ?? "draft"}</span>
                                      </div>
                                      {page.isDraft ? (
                                        <span className="inline-flex rounded-full border border-[rgba(30,174,219,0.24)] bg-[rgba(30,174,219,0.12)] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#8ee6ff]">
                                          Draft
                                        </span>
                                      ) : page.isReadyToSync && !page.persistedId ? (
                                        <span className="inline-flex rounded-full border border-[rgba(52,211,153,0.24)] bg-[rgba(52,211,153,0.12)] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#8af0c7]">
                                          Ready
                                        </span>
                                      ) : null}
                                    </div>
                                  </div>
                                  <span
                                    role="button"
                                    tabIndex={0}
                                    onClick={(event) => {
                                      event.stopPropagation();
                                      handleDeletePage(chapter.id, page.id);
                                    }}
                                    onKeyDown={(event) => {
                                      if (event.key === "Enter" || event.key === " ") {
                                        event.preventDefault();
                                        handleDeletePage(chapter.id, page.id);
                                      }
                                    }}
                                    className="rounded-full p-1 text-white/55 transition hover:bg-white/10"
                                    aria-label={`Delete ${page.title}`}
                                  >
                                    <Trash2 size={18} />
                                  </span>
                                </div>
                              </button>
                            );
                          })}
                        </div>

                        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                          <button
                            type="button"
                            onClick={() => handleAddPage(chapter.id)}
                            className="inline-flex items-center gap-2 rounded-full px-1 py-1 text-sm font-medium text-white/55 transition hover:text-white"
                          >
                            <Plus size={18} />
                            Add Page
                          </button>
                          <p className="text-xs text-white/45">
                            {savingChapterId === chapter.id
                              ? "Sedang menyimpan chapter ke course module..."
                              : "Edit judul chapter lalu tekan Enter untuk langsung create/update module."}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </aside>
              </div>

              <div className="mt-6 rounded-[20px] border border-[rgba(255,209,102,0.32)] bg-[rgba(255,209,102,0.12)] px-5 py-4 text-[#ffd166] shadow-[0_10px_22px_rgba(215,174,84,0.12)]">
                <p className="text-sm font-semibold">You Have Unsaved Changes</p>
                <p className="mt-1 text-sm text-[#ffe3a1]">
                  Module dan lesson existing sudah diambil dari API. Untuk sementara save dilakukan per chapter dan per lesson di local draft dulu, jadi struktur UX-nya sudah siap sebelum wiring upload dan create/update backend dipasang.
                </p>
              </div>
            </div>
          </div>
        </section>
      </section>
    </main>
  );
}

























