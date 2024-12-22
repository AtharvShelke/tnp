'use client';
import DashboardCard from "@/components/dashboard/DashboardCard";
import FormHeader from "@/components/dashboard/FormHeader";
import SelectInput from "@/components/FormInput/SelectInput";
import SubmitButton from "@/components/FormInput/SubmitButton";
import TextInput from "@/components/FormInput/TextInput";
import { getRequest } from "@/lib/apiRequest";
import { User } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

export default function NewCoordinator({ initialData = {}, isUpdate = false }) {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: initialData,
  });
  const [data, setData] = useState(null);
  const [departments, setDepartments] = useState([]);
  const [coordinatorFlag, setCoordinatorFlag] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { data: session, status } = useSession();
  const userId = session?.user?.id;

  const router = useRouter()


  useEffect(() => {
    if (!userId) {
      setLoading(false);

      return;
    }

    const fetchData = async () => {
      // coordinator/${userId}
      try {
        const result = await getRequest(`coordinator/${userId}`)
        setCoordinatorFlag(result.isCoordinator)
        setData(result.data);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId]);
  useEffect(() => {
    const fetchDepartments = async () => {
      // departments
      const department = await getRequest('departments')
      setDepartments(department);
    };
    fetchDepartments();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }
  const onSubmit = async (formContent) => {
    formContent.userId = data?.id
    formContent.isProfileComplete = true
    setLoading(true);
    try {

      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/coordinator`, {
        method: "POST",
        headers: {
          "Content-Type": 'application/json'
        },
        body: JSON.stringify(formContent)

      });
      setLoading(false)
      if (response.ok) {
        toast.success('Successfully added the coordinator')
        reset();
      } else {
        const errorText = await response.text(); // Get the response text in case it's not JSON
        console.log(errorText);
        toast.error(`Error: ${errorText || 'An error occurred'}`);
      }
      router.push('/dashboard')
    } catch (error) {
      setLoading(false);

      toast.error(`Error: ${error.message}`);
    }

  }

  if (data?.role === "COORDINATOR") {
    if (!coordinatorFlag) {
      return (
        <div className="p-6">
          <FormHeader title="Coordinator" href="/" />
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="w-full max-w-3xl p-4 bg-white border border-gray-200 rounded-lg shadow sm:p-6 md:p-8 mx-auto my-5"
          >
            <div className="grid gap-4 sm:grid-cols-2 sm:gap-6">

              <h2 className="col-span-2" >{data?.name}</h2>
              <h2 className="col-span-2">{data?.email}</h2>

              <TextInput
                label="Phone"
                name="phone"
                register={register}
                errors={errors}
                type="number"
              />
              <SelectInput
                register={register}
                className="w-full"
                name="departmentId"
                label="Select the Department"
                options={departments}
              />



            </div>




            <SubmitButton isLoading={loading} title={'Department'} />
          </form>
        </div>
      );
    } else {
      router.push('/dashboard')
    }



  }



  if (data?.role === "ADMIN") {
    return (
      <div>
        <h1>Unauthorized this is a coordinator page and you are an admin</h1>
      </div>
    );
  }



}
