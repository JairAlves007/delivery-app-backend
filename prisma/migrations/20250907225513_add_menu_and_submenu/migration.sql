-- CreateTable
CREATE TABLE "public"."menus" (
    "id" SERIAL NOT NULL,
    "label" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "for_role" "public"."RoleType" NOT NULL,
    "establishment_id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "menus_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."submenus" (
    "id" SERIAL NOT NULL,
    "label" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "menu_id" INTEGER NOT NULL,

    CONSTRAINT "submenus_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "menus_establishment_id_slug_for_role_key" ON "public"."menus"("establishment_id", "slug", "for_role");

-- CreateIndex
CREATE UNIQUE INDEX "submenus_menu_id_slug_key" ON "public"."submenus"("menu_id", "slug");

-- AddForeignKey
ALTER TABLE "public"."menus" ADD CONSTRAINT "menus_establishment_id_fkey" FOREIGN KEY ("establishment_id") REFERENCES "public"."establishments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."submenus" ADD CONSTRAINT "submenus_menu_id_fkey" FOREIGN KEY ("menu_id") REFERENCES "public"."menus"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
