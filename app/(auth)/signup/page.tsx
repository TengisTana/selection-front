"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button, Form, Input, message } from "antd";
import { signup } from "@/app/api/action";

const SignupPage = () => {
  const [form] = Form.useForm();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values: any) => {
    setLoading(true);
    try {
      const response = await signup({
        username: values.username,
        email: values.email,
        password: values.password,
        role: values.role,
      });
      message.success("signup successful!", 5);
      router.push("/editor/new");
      form.resetFields();
    } catch (error: any) {
      message.error(
        error.response?.data?.message || "signup failed. Please try again.",
        5
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6">Sign Up</h2>
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          initialValues={{ role: "USER" }}
        >
          <Form.Item
            name="username"
            label="Username"
            rules={[
              { required: true, message: "Please enter your username" },
              { min: 3, message: "Username must be at least 3 characters" },
            ]}
          >
            <Input placeholder="Enter your username" />
          </Form.Item>

          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: "Please enter your email" },
              { type: "email", message: "Please enter a valid email" },
            ]}
          >
            <Input placeholder="Enter your email" />
          </Form.Item>

          <Form.Item
            name="password"
            label="Password"
            rules={[
              { required: true, message: "Please enter your password" },
              { min: 8, message: "Password must be at least 8 characters" },
              {
                pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
                message:
                  "Password must contain at least one uppercase letter, one lowercase letter, and one number",
              },
            ]}
          >
            <Input.Password placeholder="Enter your password" />
          </Form.Item>

          <Form.Item name="role" hidden>
            <Input type="hidden" value="USER" />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              block
              loading={loading}
              className="bg-blue-500 hover:bg-blue-600"
            >
              Sign Up
            </Button>
          </Form.Item>
        </Form>
        <p className="text-center mt-4">
          Already have an account?{" "}
          <Link href="/signin" className="text-blue-500 hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignupPage;
