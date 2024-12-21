import express from "express";
import crypto from "crypto";

const router = express.Router();

const config = {
  vnp_TmnCode: process.env.VNP_TMNCODE,
  vnp_HashSecret: process.env.VNP_HASHSECRET,
  vnp_Url: process.env.VNP_URL,
  vnp_ReturnUrl: process.env.VNP_RETURN_URL,
};

// Tạo URL thanh toán
router.post("/create_payment", (req, res) => {
  const { amount, orderDescription, orderId } = req.body;

  // Kiểm tra dữ liệu đầu vào
  if (!amount || !orderDescription || !orderId) {
    return res.status(400).json({ message: "Dữ liệu không đầy đủ." });
  }

  const ipAddr = req.headers["x-forwarded-for"] || req.socket.remoteAddress || "::1";

  const vnp_Params = {
    vnp_Version: "2.1.0",
    vnp_Command: "pay",
    vnp_TmnCode: config.vnp_TmnCode,
    vnp_Amount: amount , // Nhân 100 để chuyển sang đơn vị VNPay yêu cầu
    vnp_CreateDate: new Date().toISOString().replace(/[-:TZ]/g, "").slice(0, 14),
    vnp_CurrCode: "VND",
    vnp_IpAddr: ipAddr,
    vnp_Locale: "vn",
    vnp_OrderInfo: orderDescription,
    vnp_OrderType: "billpayment",
    vnp_ReturnUrl: config.vnp_ReturnUrl,
    vnp_TxnRef: orderId,
  };

  console.log("VNPay Params Before Sorting:", vnp_Params);

  // Sắp xếp và loại bỏ các giá trị rỗng
  const sortedParams = new URLSearchParams();
  Object.entries(vnp_Params)
    .sort(([key1], [key2]) => key1.localeCompare(key2)) // Sắp xếp các tham số theo thứ tự alphabet
    .forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== "") {
        sortedParams.append(key, value.toString());
      }
    });

  // Tạo chữ ký
  const signData = sortedParams.toString();
  const hmac = crypto.createHmac("sha512", config.vnp_HashSecret);
  const signed = hmac.update(Buffer.from(signData, "utf-8")).digest("hex");

  // Thêm chữ ký vào URL
  sortedParams.append("vnp_SecureHash", signed);

  console.log("Generated SecureHash:", signed);

  const paymentUrl = `${config.vnp_Url}?${sortedParams.toString()}`;
  console.log("Generated Payment URL:", paymentUrl);

  res.status(200).json({ paymentUrl });
});

export default router;
