import React from "react";

const mockusers = [
  { email: "anurenj@gmail.com", password: "1234", role: "admin" },
  { email: "achu@gmail.com", password: "qwer", role: "user" },
];

function login(email, password) {
  return new Promise((resolve, reject) => {
    console.log('inside the auth function')
   setTimeout(() => {
      const user = mockusers.find(
        (u) => u.email === email && u.password === password
      );

      if (user) {
        resolve({
          token: "dummyToken",
          role: user.role,
        });
      } else {
        reject(new Error("invalid credentials"));
      }
    }, 1000);
  });
}
export default login;
