-- CreateTable
CREATE TABLE "lists" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "archived_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "lists_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "items" (
    "id" UUID NOT NULL,
    "list_id" UUID NOT NULL,
    "title" TEXT NOT NULL,
    "is_done" BOOLEAN NOT NULL DEFAULT false,
    "note" TEXT,
    "due_date" TIMESTAMP(3),
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "completed_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "items_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "lists_sort_order_idx" ON "lists"("sort_order");

-- CreateIndex
CREATE INDEX "lists_archived_at_idx" ON "lists"("archived_at");

-- CreateIndex
CREATE INDEX "items_list_id_idx" ON "items"("list_id");

-- CreateIndex
CREATE INDEX "items_list_id_sort_order_idx" ON "items"("list_id", "sort_order");

-- CreateIndex
CREATE INDEX "items_list_id_is_done_idx" ON "items"("list_id", "is_done");

-- CreateIndex
CREATE INDEX "items_due_date_idx" ON "items"("due_date");

-- AddForeignKey
ALTER TABLE "items" ADD CONSTRAINT "items_list_id_fkey" FOREIGN KEY ("list_id") REFERENCES "lists"("id") ON DELETE CASCADE ON UPDATE CASCADE;
