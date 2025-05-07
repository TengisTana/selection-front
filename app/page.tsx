"use client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { Button, message, Skeleton } from "antd";
import TestCard from "@/components/TestCard";
import { DeleteTestById, GetAllTests } from "./api/action";
import { TestBasicProps } from "@/utils/componentTypes";

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

  const CreateNewTestButton = () => (
    <Button
      onClick={() => router.push("/editor/new")}
      type="primary"
      style={{ marginBottom: "16px" }}
    >
      Create new test
    </Button>
  );

  return (
    <div>
      <CreateNewTestButton />

      {isLoading ? (
        <Skeleton />
      ) : error ? (
        <div>
          <p>Error loading tests. Please try again later.</p>
        </div>
      ) : !userTests || userTests.length === 0 ? (
        <div>
          <p>No tests found. Start by creating a new test!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {userTests.map((test: TestBasicProps, index: number) => (
            <TestCard
              key={index}
              {...test}
              onEdit={editTest}
              onDelete={deleteTest}
            />
          ))}
        </div>
      )}
    </div>
  );
}
