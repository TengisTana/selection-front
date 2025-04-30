import { ConfigProvider } from "antd";

export default function TestLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ConfigProvider
      theme={{
        components: {
          Checkbox: {
            colorText: "#FFFFFF",
            colorPrimary: "#262626",
            colorPrimaryHover: "#262626",
            colorBorder: "#FFFFFF",
          },
          Radio: {
            colorPrimary: "#262626",
            colorText: "#FFFFFF",
          },
          Card: {
            colorTextHeading: "#FFFFFF",
            colorBgContainer: "#424242",
          },
          Select: {
            optionSelectedBg: "#262626",
            colorBgElevated: "#424242",
            colorText: "#FFFFFF",
            colorBgContainer: "#262626",
            hoverBorderColor: "#424242",
            activeBorderColor: "#424242",
          },
          Input: {
            colorText: "#FFFFFF",
            activeBg: "#262626",
            addonBg: "#262626",
            activeBorderColor: "#424242",
            hoverBorderColor: "#424242",
            colorBgContainer: "#262626",
          },
          Button: {
            defaultHoverBorderColor: "#424242",
          },
        },
      }}
    >
      <>{children}</>
    </ConfigProvider>
  );
}
