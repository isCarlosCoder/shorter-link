import { getLink } from "@/service/saveLink";
import { redirect } from "next/navigation";

export default async function Page({ params }: { params: { id: string } }) {
  await getLink(params.id)
    .then((link) => {
      redirect(link)
    })
}