-- THIS TRIGGER IS JUST FOR THR FIRST INSERT REACTION
CREATE TRIGGER IF NOT EXISTS trg_insert_reaction
AFTER
INSERT
    ON postReactions BEGIN
UPDATE
    posts
SET
    likes = likes + CASE
        WHEN NEW.reaction = 'like' THEN 1
        ELSE 0
    END,
    dislikes = dislikes + CASE
        WHEN NEW.reaction = 'dislike' THEN 1
        ELSE 0
    END
WHERE
    id = NEW.post_id
END;

-- THIS TRIGGER FOR UPDATED REACTION
CREATE TRIGGER IF NOT EXISTS trg_update_reaction
AFTER
UPDATE
    ON post_reactions BEGIN
UPDATE
    posts
SET
    likes = likes + CASE
        WHEN NEW.reaction = 'like' THEN 1
        ELSE -1
    END,
    dislikes = dislikes + CASE
        WHEN NEW.reaction = 'dislike' THEN 1
        ELSE -1
    END
WHERE
    id = NEW.post_id
END;

-- THIS TRIGGER FOR DELETED REACTION
CREATE TRIGGER IF NOT EXISTS trg_delete_reaction
AFTER
    DELETE ON post_reactions BEGIN
UPDATE
    posts
SET
    likes = likes - CASE
        WHEN OLD.reaction = 'like' THEN 1
        ELSE -1
    END,
    dislikes = dislikes - CASE
        WHEN OLD.reaction = 'dislike' THEN 1
        ELSE -1
    END
WHERE
    id = NEW.post_id
END;