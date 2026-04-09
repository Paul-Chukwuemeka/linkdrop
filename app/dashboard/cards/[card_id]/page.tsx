import { CardEditor } from "@/components/cards/CardEditor";

export default async function CardEditorPage({
  params,
}: {
  params: Promise<{ card_id: string }>;
}) {
  const { card_id } = await params;
  return <CardEditor cardId={card_id} />;
}

