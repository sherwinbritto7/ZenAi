import OpenAI from "openai";
import sql from "../configs/db.js";
import { clerkClient } from "@clerk/express";
import axios from "axios";
import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
// import pdf from "pdf-parse/lib/pdf-parse.js";;
import pdf from "pdf-parse-fork";

const AI = new OpenAI({
  apiKey: process.env.GEMINI_API_KEY,
  baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/",
});

export const generateArticle = async (req, res) => {
  try {
    const { userId } = req.auth();
    const { prompt, length } = req.body;
    const plan = req.plan;
    const free_usage = req.free_usage;

    if (plan !== "premium" && free_usage >= 10) {
      return res.json({
        success: false,
        message: "Limit reached! Upgrade to continue.",
      });
    }

    const response = await AI.chat.completions.create({
      model: "gemini-3-flash-preview",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: length,
    });

    const content = response.choices[0].message.content;

    await sql` INSERT INTO creations (user_id, prompt, content, type) VALUES (${userId}, ${prompt}, ${content}, 'article')`;

    if (plan !== "premium") {
      await clerkClient.users.updateUserMetadata(userId, {
        privateMetadata: {
          free_usage: free_usage + 1,
        },
      });
    }
    res.json({ success: true, content });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

export const generateBlogTitle = async (req, res) => {
  try {
    const { userId } = req.auth();
    const { prompt } = req.body;
    const plan = req.plan;
    const free_usage = req.free_usage;

    if (plan !== "premium" && free_usage >= 10) {
      return res.json({
        success: false,
        message: "Limit reached! Upgrade to continue.",
      });
    }

    const response = await AI.chat.completions.create({
      model: "gemini-3-flash-preview",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 1000,
    });

    const content = response.choices[0].message.content;

    await sql` INSERT INTO creations (user_id, prompt, content, type) VALUES (${userId}, ${prompt}, ${content}, 'blog-title')`;

    if (plan !== "premium") {
      await clerkClient.users.updateUserMetadata(userId, {
        privateMetadata: {
          free_usage: free_usage + 1,
        },
      });
    }
    res.json({ success: true, content });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

export const generateImage = async (req, res) => {
  try {
    const { userId } = req.auth();
    const { prompt, publish } = req.body;
    const plan = req.plan;

    if (plan !== "premium") {
      return res.json({
        success: false,
        message: "This feature is only available for premium members.",
      });
    }

    const formData = new FormData();
    formData.append("prompt", prompt);

    const { data } = await axios.post(
      "https://clipdrop-api.co/text-to-image/v1",
      formData,
      {
        headers: { "x-api-key": process.env.CLIPDROP_API_KEY },
        responseType: "arraybuffer",
      },
    );

    const base64Image = `data:image/png;base64,${Buffer.from(data, "binary").toString("base64")}`;

    const { secure_url } = await cloudinary.uploader.upload(base64Image);

    await sql` INSERT INTO creations (user_id, prompt, content, type, publish) VALUES (${userId}, ${prompt}, ${secure_url}, 'image', ${publish ?? false})`;

    res.json({ success: true, content: secure_url });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

export const removeImageBackground = async (req, res) => {
  try {
    const { userId } = req.auth();
    const image = req.file;
    const plan = req.plan;

    if (plan !== "premium") {
      return res.json({
        success: false,
        message: "This feature is only available for premium members.",
      });
    }

    const { secure_url } = await cloudinary.uploader.upload(image.path, {
      transformation: [
        {
          effect: "background_removal",
          background_removal: "cloudinary_ai",
        },
      ],
    });

    await sql` INSERT INTO creations (user_id, prompt, content, type) VALUES (${userId}, 'Remove background from image', ${secure_url}, 'image')`;

    res.json({ success: true, resultImage: secure_url });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

export const removeImageObject = async (req, res) => {
  try {
    const { userId } = req.auth();
    // 1. Match the key from frontend (we used 'prompt' in formData)
    const { prompt } = req.body;
    const file = req.file;
    const plan = req.plan;

    if (!file) {
      return res.json({ success: false, message: "No image provided" });
    }

    if (plan !== "premium") {
      return res.json({
        success: false,
        message: "This feature is only available for premium members.",
      });
    }

    // 2. Upload the original image first
    const uploadResponse = await cloudinary.uploader.upload(file.path, {
      folder: "object_removal",
    });

    // 3. Generate the URL with the Generative AI effect
    // Syntax must be: gen_remove:prompt_yourobject
    const imageUrl = cloudinary.url(uploadResponse.public_id, {
      transformation: [{ effect: `gen_remove:prompt_${prompt}` }],
      secure: true,
      resource_type: "image",
    });

    // 4. Save to DB
    await sql` 
      INSERT INTO creations (user_id, prompt, content, type) 
      VALUES (${userId}, ${`Removed ${prompt}`}, ${imageUrl}, 'image')
    `;

    // 5. Send 'resultImage' to match the frontend state
    res.json({ success: true, resultImage: imageUrl });
  } catch (error) {
    console.error("Object Removal Error:", error.message);
    res.json({ success: false, message: error.message });
  }
};

export const resumeReview = async (req, res) => {
  try {
    const { userId } = req.auth();
    const resume = req.file;
    const plan = req.plan;

    if (!resume)
      return res.json({ success: false, message: "No file uploaded." });

    // 1. Read the file into a buffer
    const dataBuffer = fs.readFileSync(resume.path);

    // 2. Parse the PDF using the fork
    // The fork removes the canvas dependency that crashes Vercel
    const data = await pdf(dataBuffer);
    const pdfText = data.text;

    if (!pdfText || pdfText.trim().length === 0) {
      return res.json({
        success: false,
        message: "Could not extract text from PDF.",
      });
    }

    // 3. Send to AI (Gemini)
    const prompt = `Review this resume and provide an ATS score and feedback: \n\n ${pdfText}`;

    const response = await AI.chat.completions.create({
      model: "gemini-3-flash-preview",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
    });

    const analysis = response.choices[0].message.content;

    // 4. DB Insert
    await sql`INSERT INTO creations (user_id, prompt, content, type) 
              VALUES (${userId}, 'Resume Review', ${analysis}, 'resume-review')`;

    res.json({ success: true, analysis });
  } catch (error) {
    console.error("Resume Review Error:", error);
    res.json({ success: false, message: "Analysis failed. Please try again." });
  } finally {
    // Cleanup the temp file
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
  }
};
