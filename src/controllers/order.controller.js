import express from "express";
import { OrderModel } from "../models/order.model.js";
import { ProductsModel } from "../models/product.model.js";
class OrderController {
  getListOrders = async (req, res) => {
    try {
      const { page = 1, pageSize = 10 } = req.query;
      const skip = (page - 1) * pageSize;

      const orders = await OrderModel.find()
        .populate("user", "name")
        .populate("product", "name price")
        .skip(skip)
        .limit(parseInt(pageSize))
        .exec();

      const totalOrders = await OrderModel.countDocuments();

      return res.status(200).json({
        data: orders,
        totalOrders,
        totalPages: Math.ceil(totalOrders / pageSize),
        currentPage: parseInt(page),
      });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  };

  createOrder = async (req, res) => {
    try {
      const { user, product, quantity } = req.body;

      const productData = await ProductsModel.findById(product);
      if (!productData) {
        return res.status(404).json({ message: "Product not found" });
      }

      const totalPrice = productData.price * quantity;

      const newOrder = new OrderModel({
        user,
        product,
        quantity,
        totalPrice,
      });

      await newOrder.save();

      return res.status(201).json({
        message: "Order created successfully",
        order: newOrder,
      });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  };

  approveOrder = async (req, res) => {
    try {
      const { orderId } = req.params;

      const order = await OrderModel.findById(orderId);
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }

      if (order.status !== "pending") {
        return res
          .status(400)
          .json({ message: "Order is not in pending status" });
      }

      order.status = "paid";
      await order.save();

      return res.status(200).json({
        message: "Order approved successfully",
        order,
      });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  };
}
export default new OrderController();
