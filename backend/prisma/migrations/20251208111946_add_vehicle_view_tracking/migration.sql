-- CreateTable
CREATE TABLE "VehicleView" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "vehicleId" TEXT NOT NULL,
    "viewedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "VehicleView_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "VehicleView_vehicleId_idx" ON "VehicleView"("vehicleId");

-- CreateIndex
CREATE INDEX "VehicleView_userId_idx" ON "VehicleView"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "VehicleView_userId_vehicleId_key" ON "VehicleView"("userId", "vehicleId");

-- AddForeignKey
ALTER TABLE "VehicleView" ADD CONSTRAINT "VehicleView_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VehicleView" ADD CONSTRAINT "VehicleView_vehicleId_fkey" FOREIGN KEY ("vehicleId") REFERENCES "Vehicle"("id") ON DELETE CASCADE ON UPDATE CASCADE;
