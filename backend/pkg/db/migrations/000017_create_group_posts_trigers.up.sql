CREATE TRIGGER increment_group_post_comments
AFTER INSERT ON group_comments
BEGIN
  UPDATE group_posts
  SET comments = comments + 1
  WHERE id = NEW.group_post_id;
END;
CREATE TRIGGER decrement_group_post_comments
AFTER DELETE ON group_comments
BEGIN
  UPDATE group_posts
  SET comments = comments - 1
  WHERE id = OLD.group_post_id;
END;
