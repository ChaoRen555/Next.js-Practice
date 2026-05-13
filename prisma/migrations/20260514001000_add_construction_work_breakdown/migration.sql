-- CreateTable
CREATE TABLE `UnitProject` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `projectId` INTEGER NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `code` VARCHAR(80) NULL,
    `description` TEXT NULL,
    `status` ENUM('PLANNED', 'IN_PROGRESS', 'PAUSED', 'COMPLETED', 'CANCELLED') NOT NULL DEFAULT 'PLANNED',
    `plannedStartDate` DATETIME(3) NULL,
    `plannedEndDate` DATETIME(3) NULL,
    `actualStartDate` DATETIME(3) NULL,
    `actualEndDate` DATETIME(3) NULL,
    `progress` INTEGER NOT NULL DEFAULT 0,
    `sortOrder` INTEGER NOT NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `UnitProject_projectId_idx`(`projectId`),
    INDEX `UnitProject_status_idx`(`status`),
    INDEX `UnitProject_plannedEndDate_idx`(`plannedEndDate`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `DivisionWork` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `unitProjectId` INTEGER NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `code` VARCHAR(80) NULL,
    `description` TEXT NULL,
    `category` VARCHAR(120) NULL,
    `status` ENUM('PLANNED', 'IN_PROGRESS', 'PAUSED', 'COMPLETED', 'CANCELLED') NOT NULL DEFAULT 'PLANNED',
    `plannedStartDate` DATETIME(3) NULL,
    `plannedEndDate` DATETIME(3) NULL,
    `actualStartDate` DATETIME(3) NULL,
    `actualEndDate` DATETIME(3) NULL,
    `progress` INTEGER NOT NULL DEFAULT 0,
    `sortOrder` INTEGER NOT NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `DivisionWork_unitProjectId_idx`(`unitProjectId`),
    INDEX `DivisionWork_status_idx`(`status`),
    INDEX `DivisionWork_plannedEndDate_idx`(`plannedEndDate`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SubItemWork` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `divisionWorkId` INTEGER NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `code` VARCHAR(80) NULL,
    `description` TEXT NULL,
    `trade` VARCHAR(120) NULL,
    `quantity` DECIMAL(12, 2) NULL,
    `unit` VARCHAR(40) NULL,
    `status` ENUM('PLANNED', 'IN_PROGRESS', 'PAUSED', 'COMPLETED', 'CANCELLED') NOT NULL DEFAULT 'PLANNED',
    `plannedStartDate` DATETIME(3) NULL,
    `plannedEndDate` DATETIME(3) NULL,
    `actualStartDate` DATETIME(3) NULL,
    `actualEndDate` DATETIME(3) NULL,
    `progress` INTEGER NOT NULL DEFAULT 0,
    `sortOrder` INTEGER NOT NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `SubItemWork_divisionWorkId_idx`(`divisionWorkId`),
    INDEX `SubItemWork_status_idx`(`status`),
    INDEX `SubItemWork_plannedEndDate_idx`(`plannedEndDate`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `UnitProject`
    ADD CONSTRAINT `UnitProject_projectId_fkey`
    FOREIGN KEY (`projectId`) REFERENCES `Project`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DivisionWork`
    ADD CONSTRAINT `DivisionWork_unitProjectId_fkey`
    FOREIGN KEY (`unitProjectId`) REFERENCES `UnitProject`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SubItemWork`
    ADD CONSTRAINT `SubItemWork_divisionWorkId_fkey`
    FOREIGN KEY (`divisionWorkId`) REFERENCES `DivisionWork`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
