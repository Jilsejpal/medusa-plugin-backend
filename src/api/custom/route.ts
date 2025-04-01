import { MedusaRequest, MedusaResponse } from "@medusajs/framework";

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  try {
    const query = req.scope.resolve("query");

    const { data } = await query.graph({
      entity: "payment"!,
      fields: ["*", "*.*"],
    });
    res.json(data);
  } catch (error) {
    res.json(error).status(500);
  }
}
