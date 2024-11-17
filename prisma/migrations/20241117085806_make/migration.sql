-- AlterTable
ALTER TABLE `card` MODIFY `email` VARCHAR(191) NULL,
    MODIFY `companyName` VARCHAR(191) NULL,
    MODIFY `designation` VARCHAR(191) NULL,
    MODIFY `address` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `user` MODIFY `phoneNumber` VARCHAR(191) NULL;
