CREATE TABLE IF NOT EXISTS product_owners (
  product_id BIGINT UNSIGNED NOT NULL,
  user_id BIGINT UNSIGNED NOT NULL,
  role ENUM('owner','instructor') NOT NULL DEFAULT 'owner',

  PRIMARY KEY (product_id, user_id),
  INDEX idx_product_owners_user (user_id),
  CONSTRAINT fk_product_owners_product
    FOREIGN KEY (product_id) REFERENCES products(id)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT fk_product_owners_user
    FOREIGN KEY (user_id) REFERENCES users(id)
    ON DELETE CASCADE
    ON UPDATE CASCADE
);
