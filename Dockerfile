<<<<<<< HEAD
# Sử dụng image Node.js LTS (phiên bản ổn định) dựa trên Alpine để giảm kích thước

FROM node:lts-alpine

# Thiết lập biến môi trường NODE_ENV là production

ENV NODE_ENV=production

# Thiết lập thư mục làm việc bên trong container

WORKDIR /app

# Sao chép package.json và package-lock.json để cài đặt dependencies

# Bước này tận dụng Docker cache, giúp việc build nhanh hơn nếu dependencies không đổi

COPY package*.json ./

# Cài đặt dependencies (chỉ cài đặt dependencies cho production)

# LƯU Ý: Nếu bạn dùng các devDependencies cho việc build (ví dụ: babel), hãy xóa --omit=dev

RUN npm install

# Sao chép toàn bộ mã nguồn của ứng dụng (bao gồm thư mục src, server.js, v.v.)

# vào thư mục /app trong container

COPY . .

# Chỉ định cổng mà ứng dụng Node.js lắng nghe

# Giả định Order Service chạy trên cổng 8003

EXPOSE 8000

# Lệnh chạy ứng dụng khi container khởi động

# Đảm bảo lệnh này khớp với cách bạn chạy ứng dụng (ví dụ: node server.js)

CMD ["npm", "start"]
=======
#Sử dụng image Node.js LTS (phiên bản ổn định) dựa trên Alpine để giảm kích thước

FROM node:lts-alpine

#Thiết lập biến môi trường NODE_ENV là production

ENV NODE_ENV=production

#Thiết lập thư mục làm việc bên trong container

WORKDIR /app

#Sao chép package.json và package-lock.json để cài đặt dependencies

#Bước này tận dụng Docker cache, giúp việc build nhanh hơn nếu dependencies không đổi

COPY package*.json ./

#Cài đặt dependencies (chỉ cài đặt dependencies cho production)

#LƯU Ý: Nếu bạn dùng các devDependencies cho việc build (ví dụ: babel), hãy xóa --omit=dev

RUN npm install

#Sao chép toàn bộ mã nguồn của ứng dụng (bao gồm thư mục src, server.js, v.v.)

#vào thư mục /app trong container

COPY . .

#Chỉ định cổng mà ứng dụng Node.js lắng nghe

#Giả định Order Service chạy trên cổng 8003

EXPOSE 8000

#Lệnh chạy ứng dụng khi container khởi động

#Đảm bảo lệnh này khớp với cách bạn chạy ứng dụng (ví dụ: node server.js)

CMD ["npm", "run", "start"]
>>>>>>> 340173087d8917f22f1c39af073ed3a9f86b8c03
