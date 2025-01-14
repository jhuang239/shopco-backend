import { Request, Response } from "express";
import Review, { ReviewAttributes } from "../models/review";

const createReview = async (req: Request, res: Response) => {
  try {
    const { comment, rating, user_id, product_id } =
      req.body as ReviewAttributes;
    const review = await Review.create({
      comment,
      rating,
      user_id,
      product_id,
      comment_date: new Date(),
    });
    res.status(201).json(review);
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(500).json({ error: "Internal server error" });
    }
  }
};

const updateReview = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { comment, rating } = req.body as ReviewAttributes;
    const review = await Review.findByPk(id);
    if (!review) {
      res.status(404).json({ error: "Review not found" });
      return;
    }
    await review.update({ comment, rating });
    res.status(200).json(review);
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(500).json({ error: "Internal server error" });
    }
  }
};

const deleteReview = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const review = await Review.findByPk(id);
    if (!review) {
      res.status(404).json({ error: "Review not found" });
      return;
    }
    await review.destroy();
    res.status(204).end();
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(500).json({ error: "Internal server error" });
    }
  }
};

export { createReview, updateReview, deleteReview };
