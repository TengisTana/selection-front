"use client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { DeleteTestById, GetAllTests } from "./api/action";
import { message, Skeleton } from "antd";
import TestCard from "@/components/TestCard";
import { TestBasicProps } from "@/utils/componentTypes";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const {
    data: userTests,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["allTests"],
    queryFn: () => GetAllTests(),
    enabled: true,
    refetchOnWindowFocus: false,
  });

  const deleteTestMutation = useMutation({
    mutationFn: (id: string) => DeleteTestById(id),
    onSuccess: () => {
      message.success("Test deleted successfully!");
      queryClient.invalidateQueries({ queryKey: ["allTests"] });
    },
    onError: () => {
      message.error("Failed to delete test. Please try again.");
    },
  });

  const deleteTest = (id: string) => {
    deleteTestMutation.mutate(id);
  };

  const editTest = (id: string) => {
    router.push(`/editor/${id}`);
  };

  if (isLoading) {
    return <Skeleton />;
  }

  if (error) {
    return <div>Error</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {userTests.map((test: TestBasicProps, index: number) => (
        <TestCard key={index} {...test} onEdit={editTest} onDelete={deleteTest}/>
      ))}
    </div>
  );
}
