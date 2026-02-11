import sql from "../configs/db.js";

export const getUserCreations = async (req, res) => {
  try {
    const { userId } = req.auth();

    const creations =
      await sql`SELECT * FROM creations WHERE user_id = ${userId} ORDER BY created_at DESC`;

    res.json({ success: true, creations });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const getPublishedCreations = async (req, res) => {
  try {
    const creations =
      await sql`SELECT * FROM creations WHERE publish = true ORDER BY created_at DESC`;

    res.json({ success: true, creations });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const toggleLikeCreations = async (req, res) => {
  try {
    const { userId } = req.auth();
    const { id } = req.body;

    const [creation] = await sql`SELECT * FROM creations WHERE id = ${id}`;

    if (!creation) {
      return res.json({ success: false, message: "Creation not found" });
    }

    const currentLikes = creation.likes;
    const userIdStr = userId.toString();
    let updatedLikes;
    let message;

    if (currentLikes.includes(userIdStr)) {
      updatedLikes = currentLikes.filter((user) => user !== userIdStr);
      message = "Creation Unliked";
    } else {
      updatedLikes = [...currentLikes, userIdStr];
      message = "Creation Liked";
    }

    const formattedArray = `{${updatedLikes.join(",")}}`;

    await sql`UPDATE creations SET likes = ${formattedArray}::text[] WHERE id = ${id}`;

    res.json({ success: true, message });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const deleteCreation = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.auth;

    const [creation] =
      await sql`SELECT user_id FROM creations WHERE id = ${id}`;

    if (!creation) {
      return res
        .status(404)
        .json({ success: false, message: "Creation not found" });
    }

    if (creation.user_id !== userId) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized: You can only delete your own creations",
      });
    }

    await sql`DELETE FROM creations WHERE id = ${id}`;

    res.json({ success: true, message: "Creation deleted successfully" });
  } catch (error) {
    console.error("SQL DELETE ERROR:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};
