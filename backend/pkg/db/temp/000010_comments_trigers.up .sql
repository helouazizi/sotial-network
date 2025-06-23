
CREATE TRIGGER increment_total_comments
AFTER INSERT ON comments
BEGIN
  UPDATE posts
  SET total_comments = total_comments + 1
  WHERE id = NEW.post_id;
END;