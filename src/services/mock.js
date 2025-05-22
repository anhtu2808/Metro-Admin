import MockAdapter from "axios-mock-adapter";
import api from "./api";

// Khởi tạo mock
const mock = new MockAdapter(api, { delayResponse: 800 });

// Mock endpoint POST /auth/login
mock.onPost("/auth/login").reply((config) => {
  const { email, password } = JSON.parse(config.data);

  if (email === "admin@example.com" && password === "123456") {
    return [
      200,
      {
        accessToken: "mock-access-token-123",
        refreshToken: "mock-refresh-token-456",
      },
    ];
  }

  return [401, { message: "Unvalid email or password" }];
});
console.log("✅ Mocking is running");
// Mock thêm các API khác nếu cần sau này
// mock.onGet('/users').reply(200, [...]);

export default mock;
