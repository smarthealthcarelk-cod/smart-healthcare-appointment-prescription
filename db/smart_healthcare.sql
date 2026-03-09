-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Mar 07, 2026 at 04:11 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `smart_healthcare`
--

-- --------------------------------------------------------

--
-- Table structure for table `appointments`
--

CREATE TABLE `appointments` (
  `id` varchar(36) NOT NULL,
  `patient_id` varchar(36) NOT NULL,
  `doctor_id` varchar(36) NOT NULL,
  `hospital_id` int(11) NOT NULL,
  `date` date NOT NULL,
  `time` varchar(10) NOT NULL,
  `status` enum('pending','confirmed','completed','cancelled') DEFAULT 'pending',
  `reason` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `appointments`
--

INSERT INTO `appointments` (`id`, `patient_id`, `doctor_id`, `hospital_id`, `date`, `time`, `status`, `reason`, `created_at`) VALUES
('043847cc-9b14-4910-bd9a-b8d9cc719865', 'f426836a-979e-4ee9-a833-5e61b2fa51f4', 'ae7e9612-816a-44d6-92e9-45c86a28fe0b', 8, '2026-03-05', '10:00', 'confirmed', 'Child vaccination', '2026-02-26 05:57:40'),
('19429614-933e-41ab-a9ff-0c8f06a75afa', '04701b24-1a34-11f1-9fac-00e04c439e27', '63d90282-f47e-4efd-85a7-ac6c5df67b11', 2, '2026-03-08', '09:00', 'cancelled', 'checkup', '2026-03-07 14:50:56'),
('1b160859-ce17-4e76-8594-6a4d60e2cdfe', 'f426836a-979e-4ee9-a833-5e61b2fa51f4', 'ae7e9612-816a-44d6-92e9-45c86a28fe0b', 4, '2026-03-01', '09:00', 'confirmed', 'Blood pressure review', '2026-02-26 05:57:40'),
('1dd8f8db-a5cd-40bb-9370-0dc305360658', '53474ce9-b3a7-41f3-9cb4-0ebde3ec0b7c', 'ae7e9612-816a-44d6-92e9-45c86a28fe0b', 2, '2026-03-02', '16:00', 'confirmed', 'Joint pain', '2026-02-26 05:57:40'),
('236f4b3e-c2b8-4b5e-ae93-5ed2571b5a32', '478a6df8-0f0c-49e5-95f5-06a0d6800428', '35c9cbb2-69e2-446d-b067-f76c7897fa76', 8, '2026-03-10', '08:00', 'confirmed', 'Annual physical', '2026-02-26 05:57:40'),
('2822339f-bde9-4d7a-b22d-120e112fabc4', '410e8ecb-1726-4283-9644-a48865e6e530', '35c9cbb2-69e2-446d-b067-f76c7897fa76', 8, '2026-03-07', '08:00', 'confirmed', 'Blood pressure review', '2026-02-26 05:57:40'),
('300b070b-4eac-4e85-8af8-fa4337fad3b3', 'ae6b93bb-0aa6-47cc-9a38-8b6df2da8226', '1d53582b-2f66-43c4-8eb6-dc7df68bbd86', 7, '2026-03-14', '14:00', 'cancelled', 'Blood pressure review', '2026-02-26 05:57:40'),
('3aea6207-41a3-4c34-86fc-b48817df652f', 'f426836a-979e-4ee9-a833-5e61b2fa51f4', '66f7d975-d975-4f66-9e16-2f8d0de9e1f0', 3, '2026-02-19', '16:00', 'cancelled', 'Eye checkup', '2026-02-26 05:57:40'),
('484699fb-e80c-46ca-b74e-b3dcab6c6151', 'af106a9e-575f-4385-a5b3-753296bd40d1', 'a5a1e120-0cf9-4c42-a4d8-e79bc3b955e1', 2, '2026-02-27', '15:00', 'confirmed', 'Blood pressure review', '2026-02-26 05:57:40'),
('49a46d73-6c80-4ab6-b039-7fceb618e41f', '4551a367-9be9-45e6-be86-fb76c96fe070', 'a5a1e120-0cf9-4c42-a4d8-e79bc3b955e1', 12, '2026-03-12', '09:00', 'confirmed', 'Eye checkup', '2026-02-26 05:57:40'),
('5d1d3442-a93a-49af-b3bd-b8ef86318dac', 'af106a9e-575f-4385-a5b3-753296bd40d1', 'f1c0e86d-a031-4a1a-9ab3-9eecd2aefeb9', 9, '2026-02-28', '08:00', 'pending', 'Prenatal visit', '2026-02-26 05:57:40'),
('791e5717-fd71-45a5-86b9-3216856ee7a9', '2d70a4ef-c156-4b82-8f7e-3dc0bd2cb615', 'ae7e9612-816a-44d6-92e9-45c86a28fe0b', 10, '2026-02-24', '11:00', 'completed', 'Blood pressure review', '2026-02-26 05:57:40'),
('7de8f1ba-4c8c-4d33-9e01-346c8f71e216', '11a2ba23-7796-4564-a6bc-d03c93dc4dba', 'ae7e9612-816a-44d6-92e9-45c86a28fe0b', 5, '2026-03-09', '15:00', 'pending', 'Fever and cough', '2026-02-26 05:57:40'),
('872e0c63-1f83-4328-aae7-495038a7f1ad', 'ae6b93bb-0aa6-47cc-9a38-8b6df2da8226', '639553b3-02ca-4ea5-a06b-ead51b5dd13b', 11, '2026-02-26', '14:00', 'completed', 'asdasasdasd', '2026-02-26 06:23:06'),
('876a70a3-a06a-41de-88bf-97e8c7b5c9f3', '2d70a4ef-c156-4b82-8f7e-3dc0bd2cb615', '35c9cbb2-69e2-446d-b067-f76c7897fa76', 7, '2026-02-26', '15:00', 'confirmed', 'Annual physical', '2026-02-26 05:57:40'),
('9af8c24c-43f7-4b93-a605-b1bb27a7300b', '1a4e32fb-d58b-440e-bd5a-2f2d9cd14bae', '66f7d975-d975-4f66-9e16-2f8d0de9e1f0', 5, '2026-02-21', '15:00', 'cancelled', 'Allergy symptoms', '2026-02-26 05:57:40'),
('b3b38a55-da4b-48ae-9514-28a8b89c84eb', '04701b24-1a34-11f1-9fac-00e04c439e27', 'a5a1e120-0cf9-4c42-a4d8-e79bc3b955e1', 1, '2026-03-08', '08:00', 'completed', 'full body checkup', '2026-03-07 14:49:44'),
('ca4a7f37-8235-41d3-aa6f-475f71aedd51', 'f426836a-979e-4ee9-a833-5e61b2fa51f4', '1d53582b-2f66-43c4-8eb6-dc7df68bbd86', 8, '2026-03-06', '15:00', 'confirmed', 'Follow-up consultation', '2026-02-26 05:57:40'),
('d1dd0e1c-729e-4db3-a41e-107229e857ba', '8128c1de-18a3-11f1-bf87-00e04c439e27', 'ae7e9612-816a-44d6-92e9-45c86a28fe0b', 1, '2026-03-07', '08:00', 'pending', 'aaaaa', '2026-03-05 14:58:34'),
('d6afa798-05af-49b8-ac0c-7e8a7697ded1', '478a6df8-0f0c-49e5-95f5-06a0d6800428', '63d90282-f47e-4efd-85a7-ac6c5df67b11', 2, '2026-03-06', '09:00', 'completed', 'Test', '2026-03-05 02:07:40'),
('dcd856b7-a771-449d-aad3-e58e2c9c25a0', '4551a367-9be9-45e6-be86-fb76c96fe070', '66f7d975-d975-4f66-9e16-2f8d0de9e1f0', 1, '2026-03-15', '11:00', 'confirmed', 'Child vaccination', '2026-02-26 05:57:40'),
('dd312dc3-4d33-4321-940e-af1fa3dd6ff8', '0dd05f11-849c-4a79-b409-10440c95d7b9', '1d53582b-2f66-43c4-8eb6-dc7df68bbd86', 3, '2026-03-04', '14:00', 'cancelled', 'Prenatal visit', '2026-02-26 05:57:40'),
('f3c543e9-5295-4351-ac88-93e3104e260f', '60cf4afb-ab8a-4c8c-b5e4-864cf561f55e', '26ac639e-4c6a-4975-a4cf-8f8d7cdd7f10', 1, '2026-03-11', '15:00', 'completed', 'Eye checkup', '2026-02-26 05:57:40');

-- --------------------------------------------------------

--
-- Table structure for table `doctor_schedules`
--

CREATE TABLE `doctor_schedules` (
  `id` int(11) NOT NULL,
  `doctor_id` varchar(36) NOT NULL,
  `available_days` varchar(100) DEFAULT NULL,
  `available_slots` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `doctor_schedules`
--

INSERT INTO `doctor_schedules` (`id`, `doctor_id`, `available_days`, `available_slots`) VALUES
(1, '6c28d8f3-9bcd-4fa2-ab59-7d569e03ad5e', 'Fri,Sat,Thu,Wed', '08:00,09:00,14:00,15:00,16:00'),
(2, '1d53582b-2f66-43c4-8eb6-dc7df68bbd86', 'Mon,Sat,Tue,Wed', '09:00,10:00,11:00,14:00,15:00'),
(4, '119a3252-5ed7-419f-9a8a-1e5102e1c6ac', 'Mon,Thu,Tue,Wed', '08:00,09:00,10:00,15:00,16:00'),
(5, '4d9e9ea6-78aa-47d7-bb56-682086539dd6', 'Fri,Mon,Thu,Tue', '08:00,09:00,11:00,14:00,16:00'),
(6, 'ae7e9612-816a-44d6-92e9-45c86a28fe0b', 'Fri,Mon,Tue,Wed', '08:00,10:00,11:00,14:00,15:00'),
(7, '699c77d2-43b5-4244-971f-81c13046e52f', 'Fri,Mon,Sat,Tue', '08:00,09:00,10:00,11:00,15:00'),
(8, '63d90282-f47e-4efd-85a7-ac6c5df67b11', 'Fri,Thu,Tue,Wed', '08:00,09:00,11:00,15:00,16:00'),
(9, '35c9cbb2-69e2-446d-b067-f76c7897fa76', 'Fri,Thu,Tue,Wed', '08:00,10:00,11:00,14:00,15:00'),
(10, 'f1c0e86d-a031-4a1a-9ab3-9eecd2aefeb9', 'Fri,Thu,Tue,Wed', '08:00,09:00,11:00,15:00,16:00'),
(11, '26ac639e-4c6a-4975-a4cf-8f8d7cdd7f10', 'Fri,Sat,Thu,Wed', '08:00,09:00,10:00,11:00,16:00'),
(12, '66f7d975-d975-4f66-9e16-2f8d0de9e1f0', 'Fri,Sat,Thu,Wed', '10:00,11:00,14:00,15:00,16:00'),
(13, '639553b3-02ca-4ea5-a06b-ead51b5dd13b', 'Mon,Tue,Wed,Thu,Fri', '09:00,10:00,11:00,14:00,15:00'),
(17, 'a5a1e120-0cf9-4c42-a4d8-e79bc3b955e1', 'Mon,Tue,Wed,Thu,Fri,Sat', '08:00,09:00,10:00,14:00,16:00'),
(18, '6d3b380c-81c6-4901-bcc4-5bdd4270d270', 'Mon,Tue,Wed,Thu,Fri', '09:00,10:00,11:00,14:00,15:00');

-- --------------------------------------------------------

--
-- Table structure for table `email_verification_codes`
--

CREATE TABLE `email_verification_codes` (
  `email` varchar(255) NOT NULL,
  `code` varchar(6) NOT NULL,
  `expires_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `hospitals`
--

CREATE TABLE `hospitals` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `city` varchar(100) NOT NULL,
  `address` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `hospitals`
--

INSERT INTO `hospitals` (`id`, `name`, `city`, `address`) VALUES
(1, 'National Hospital of Sri Lanka', 'Colombo', 'Colombo 10'),
(2, 'Lanka Hospital', 'Colombo', 'Colombo 05'),
(3, 'Durdans Hospital', 'Colombo', 'Colombo 03'),
(4, 'Teaching Hospital Kandy', 'Kandy', 'Peradeniya Road'),
(5, 'Teaching Hospital Karapitiya', 'Galle', 'Galle Road'),
(6, 'Jaffna Teaching Hospital', 'Jaffna', 'Hospital Road'),
(7, 'Asiri Surgical Hospital', 'Colombo', 'Kirulapona'),
(8, 'Nawaloka Hospital', 'Colombo', 'Nawam Mawatha'),
(9, 'Hemas Hospital', 'Colombo', 'Wattala Road'),
(10, 'Base Hospital Gampaha', 'Gampaha', 'Colombo Road'),
(11, 'District General Hospital Matara', 'Matara', 'Bandarawela Road'),
(12, 'Teaching Hospital Anuradhapura', 'Anuradhapura', 'New Town');

-- --------------------------------------------------------

--
-- Table structure for table `medical_records`
--

CREATE TABLE `medical_records` (
  `id` varchar(36) NOT NULL,
  `patient_id` varchar(36) NOT NULL,
  `date` date NOT NULL,
  `type` varchar(50) NOT NULL,
  `doctor_name` varchar(255) NOT NULL,
  `summary` text NOT NULL,
  `created_by` varchar(36) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `medical_records`
--

INSERT INTO `medical_records` (`id`, `patient_id`, `date`, `type`, `doctor_name`, `summary`, `created_by`, `created_at`) VALUES
('0db28751-e6a6-42d2-a760-ce752fe54500', '1a4e32fb-d58b-440e-bd5a-2f2d9cd14bae', '2026-02-25', 'Surgery Follow-up', 'Dr. Dilani Perera', 'Joint stiffness. Rheumatoid workup ordered.', 'ae7e9612-816a-44d6-92e9-45c86a28fe0b', '2026-02-26 05:57:40'),
('17a68528-ecc3-40f3-ba50-44024aa4f1af', '1a4e32fb-d58b-440e-bd5a-2f2d9cd14bae', '2026-02-20', 'Vaccination', 'Dr. Samanthi Wijesinghe', 'Annual health screening. All parameters normal.', '119a3252-5ed7-419f-9a8a-1e5102e1c6ac', '2026-02-26 05:57:40'),
('18e8501c-ad5a-4ed5-83ba-0d3d5f7885a6', '1a4e32fb-d58b-440e-bd5a-2f2d9cd14bae', '2026-02-24', 'Vaccination', 'Dr. Dilani Perera', 'Child flu vaccination completed.', 'ae7e9612-816a-44d6-92e9-45c86a28fe0b', '2026-02-26 05:57:40'),
('2e244ee4-8b95-4427-8d8f-8d88e3382c96', '478a6df8-0f0c-49e5-95f5-06a0d6800428', '2026-03-05', 'Lab', 'Dr. Chamari Gunawardena', 'sample consultaion record', '63d90282-f47e-4efd-85a7-ac6c5df67b11', '2026-03-05 02:09:09'),
('539445e0-5252-4a14-9815-90acaa0bb7da', '02bae247-f61d-433c-baab-8aa8d9d2e97e', '2026-02-22', 'Routine Check', 'Dr. Nishantha Bandara', 'Knee pain. X-ray done. Physiotherapy recommended.', '4d9e9ea6-78aa-47d7-bb56-682086539dd6', '2026-02-26 05:57:40'),
('540bc0d8-feee-45e1-a368-7ef3ff6e0f85', '53474ce9-b3a7-41f3-9cb4-0ebde3ec0b7c', '2026-02-25', 'Routine Check', 'Dr. Nishantha Bandara', 'Fever, sore throat. Diagnosed with viral infection. Prescribed Paracetamol and Amoxicillin.', '4d9e9ea6-78aa-47d7-bb56-682086539dd6', '2026-02-26 05:57:40'),
('5be87aa3-acd2-4d22-80be-36a68bcfcf56', '60cf4afb-ab8a-4c8c-b5e4-864cf561f55e', '2026-02-23', 'Surgery Follow-up', 'Dr. Dilani Perera', 'Prenatal check-up. All normal.', 'ae7e9612-816a-44d6-92e9-45c86a28fe0b', '2026-02-26 05:57:40'),
('7be70e65-5dec-4a34-b78e-5b9c89e936bb', 'af106a9e-575f-4385-a5b3-753296bd40d1', '2026-02-21', 'Surgery Follow-up', 'Dr. Mahinda Rathnayake', 'Blood pressure control reviewed. Medication adjusted.', '26ac639e-4c6a-4975-a4cf-8f8d7cdd7f10', '2026-02-26 05:57:40'),
('852df674-f831-4413-bf64-31a101b71958', 'ae6b93bb-0aa6-47cc-9a38-8b6df2da8226', '2026-02-26', 'Follow-up', 'Dr. vivekan', 'asdasda', '639553b3-02ca-4ea5-a06b-ead51b5dd13b', '2026-02-26 06:24:04'),
('8d015129-5ca7-4e1e-acf1-ce8cc32ee4ad', '04701b24-1a34-11f1-9fac-00e04c439e27', '2026-03-07', 'Consultation', 'Dr. Ajith De Silva', 'Patient visited for a routine full body check-up. Vital signs were within normal range. Patient reported occasional headaches and mild fatigue. Advised to maintain proper hydration, balanced diet, and regular sleep schedule. Multivitamins and Vitamin D supplements were prescribed. Follow-up recommended after two weeks if symptoms persist.', 'a5a1e120-0cf9-4c42-a4d8-e79bc3b955e1', '2026-03-07 15:02:14'),
('98c29946-d9d9-445e-8dc5-08331679f95b', '02bae247-f61d-433c-baab-8aa8d9d2e97e', '2026-02-19', 'Emergency', 'Dr. Mahinda Rathnayake', 'Blood pressure control reviewed. Medication adjusted.', '26ac639e-4c6a-4975-a4cf-8f8d7cdd7f10', '2026-02-26 05:57:40'),
('a1fcaed1-ed85-4cbc-bab1-94ffaecd0f0f', '53474ce9-b3a7-41f3-9cb4-0ebde3ec0b7c', '2026-02-24', 'Follow-up', 'Dr. Nishantha Bandara', 'Prenatal check-up. All normal.', '4d9e9ea6-78aa-47d7-bb56-682086539dd6', '2026-02-26 05:57:40'),
('ad4bcb73-6602-4d20-bb72-c7a5a145058c', 'ae6b93bb-0aa6-47cc-9a38-8b6df2da8226', '2026-02-23', 'Follow-up', 'Dr. Dilani Perera', 'Headache evaluation. MRI scheduled.', 'ae7e9612-816a-44d6-92e9-45c86a28fe0b', '2026-02-26 05:57:40'),
('b005c4f5-fe1c-47ac-9cbf-149abad54945', 'ae6b93bb-0aa6-47cc-9a38-8b6df2da8226', '2026-02-25', 'Vaccination', 'Dr. Ajith De Silva', 'Annual health screening. All parameters normal.', 'a5a1e120-0cf9-4c42-a4d8-e79bc3b955e1', '2026-02-26 05:57:40'),
('cd3a4e25-e9d9-43c0-b4d5-a67f63ab35bd', 'af106a9e-575f-4385-a5b3-753296bd40d1', '2026-02-20', 'Cardiac', 'Dr. Ajith De Silva', 'Prenatal check-up. All normal.', 'a5a1e120-0cf9-4c42-a4d8-e79bc3b955e1', '2026-02-26 05:57:40'),
('d490b12a-dc36-4398-b67e-0761585ed93d', 'f426836a-979e-4ee9-a833-5e61b2fa51f4', '2026-02-21', 'Follow-up', 'Dr. Thushari Abeywickrama', 'Cough and allergy. Prescribed antihistamine and inhaler.', 'f1c0e86d-a031-4a1a-9ab3-9eecd2aefeb9', '2026-02-26 05:57:40'),
('df9ca67c-2ade-486d-a2c5-7d12b2e5aed9', '1a4e32fb-d58b-440e-bd5a-2f2d9cd14bae', '2026-02-22', 'Vaccination', 'Dr. Ruwan Senanayake', 'Fever, sore throat. Diagnosed with viral infection. Prescribed Paracetamol and Amoxicillin.', '699c77d2-43b5-4244-971f-81c13046e52f', '2026-02-26 05:57:40'),
('e3a54950-1051-4d09-8f5d-f13f5c2cf909', '1a4e32fb-d58b-440e-bd5a-2f2d9cd14bae', '2026-02-19', 'Vaccination', 'Dr. Mahinda Rathnayake', 'Child flu vaccination completed.', '26ac639e-4c6a-4975-a4cf-8f8d7cdd7f10', '2026-02-26 05:57:40');

-- --------------------------------------------------------

--
-- Table structure for table `password_reset_codes`
--

CREATE TABLE `password_reset_codes` (
  `email` varchar(255) NOT NULL,
  `code` varchar(6) NOT NULL,
  `expires_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `prescriptions`
--

CREATE TABLE `prescriptions` (
  `id` varchar(36) NOT NULL,
  `patient_id` varchar(36) NOT NULL,
  `doctor_id` varchar(36) NOT NULL,
  `date` date NOT NULL,
  `medications` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`medications`)),
  `notes` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `prescriptions`
--

INSERT INTO `prescriptions` (`id`, `patient_id`, `doctor_id`, `date`, `medications`, `notes`, `created_at`) VALUES
('002f3eef-b5c3-4a94-ac42-cd65588e9431', 'f426836a-979e-4ee9-a833-5e61b2fa51f4', 'f1c0e86d-a031-4a1a-9ab3-9eecd2aefeb9', '2026-02-13', '[{\"name\":\"Azithromycin 500mg\",\"dosage\":\"1 tablet daily\",\"duration\":\"3 days\"}]', 'Complete full course. Avoid alcohol.', '2026-02-26 05:57:40'),
('470e1dac-6dec-44b7-9e90-f4b4efea3b24', '11a2ba23-7796-4564-a6bc-d03c93dc4dba', '35c9cbb2-69e2-446d-b067-f76c7897fa76', '2026-02-14', '[{\"name\":\"Prednisolone 5mg\",\"dosage\":\"2 tablets for 3 days then taper\",\"duration\":\"7 days\"}]', 'Monitor BP weekly.', '2026-02-26 05:57:40'),
('4ea50f13-ff0b-4de9-b6ef-c1e56b335fde', 'f426836a-979e-4ee9-a833-5e61b2fa51f4', '63d90282-f47e-4efd-85a7-ac6c5df67b11', '2026-02-19', '[{\"name\":\"Metronidazole 400mg\",\"dosage\":\"1 tablet 3 times daily\",\"duration\":\"7 days\"}]', 'Rest and physiotherapy advised.', '2026-02-26 05:57:40'),
('531e2135-45e0-4f52-9f44-c2acd1d56c18', '1a4e32fb-d58b-440e-bd5a-2f2d9cd14bae', 'a5a1e120-0cf9-4c42-a4d8-e79bc3b955e1', '2026-02-17', '[{\"name\":\"Metformin 500mg\",\"dosage\":\"1 tablet twice daily\",\"duration\":\"Ongoing\"}]', 'Take with food. Rest advised.', '2026-02-26 05:57:40'),
('61f3135e-af8c-43fc-b309-dd03680cd3ad', '410e8ecb-1726-4283-9644-a48865e6e530', '26ac639e-4c6a-4975-a4cf-8f8d7cdd7f10', '2026-02-18', '[{\"name\":\"Ciprofloxacin 500mg\",\"dosage\":\"1 tablet twice daily\",\"duration\":\"7 days\"}]', 'Monitor BP weekly.', '2026-02-26 05:57:40'),
('69808467-4e9f-4e56-a6d4-3eae7b2cc066', 'af106a9e-575f-4385-a5b3-753296bd40d1', '63d90282-f47e-4efd-85a7-ac6c5df67b11', '2026-02-24', '[{\"name\":\"Ciprofloxacin 500mg\",\"dosage\":\"1 tablet twice daily\",\"duration\":\"7 days\"}]', 'For fever and infection. Complete full course.', '2026-02-26 05:57:40'),
('6f4bff8b-cece-430c-bfc5-9961081b1069', '478a6df8-0f0c-49e5-95f5-06a0d6800428', '63d90282-f47e-4efd-85a7-ac6c5df67b11', '2026-03-05', '[{\"name\":\"med \",\"dosage\":\"qqq\",\"duration\":\"111\"},{\"name\":\"www\",\"dosage\":\"www\",\"duration\":\"www\"}]', 'sdfsdfsdfsdfsdf', '2026-03-05 02:08:41'),
('714650c1-ff1a-464f-999d-0eb28a5d02e9', '40041a66-3092-453a-b54e-130f1dbed1d3', '66f7d975-d975-4f66-9e16-2f8d0de9e1f0', '2026-02-23', '[{\"name\":\"Aspirin 75mg\",\"dosage\":\"1 tablet daily\",\"duration\":\"Ongoing\"},{\"name\":\"Atorvastatin 20mg\",\"dosage\":\"1 tablet at night\",\"duration\":\"Ongoing\"}]', 'Taper as directed. Do not stop suddenly.', '2026-02-26 05:57:40'),
('827881db-fa4c-4d83-97ce-acabc7319661', '11a2ba23-7796-4564-a6bc-d03c93dc4dba', '66f7d975-d975-4f66-9e16-2f8d0de9e1f0', '2026-02-21', '[{\"name\":\"Ciprofloxacin 500mg\",\"dosage\":\"1 tablet twice daily\",\"duration\":\"7 days\"}]', 'Avoid alcohol during treatment.', '2026-02-26 05:57:40'),
('87f0bd5d-27b7-416c-9c5e-d2a913b6831a', '04701b24-1a34-11f1-9fac-00e04c439e27', 'a5a1e120-0cf9-4c42-a4d8-e79bc3b955e1', '2026-03-07', '[{\"name\":\"Paracetamol 500mg\",\"dosage\":\"1 tablet after meals, twice daily\",\"duration\":\"3 days\"},{\"name\":\"Vitamin D3 1000 IU\",\"dosage\":\"1 capsule once daily\",\"duration\":\"30 days\"},{\"name\":\"Multivitamin Tablet\",\"dosage\":\"1 tablet once daily after breakfast\",\"duration\":\"30days\"}]', NULL, '2026-03-07 15:00:49'),
('8c402643-22ec-4c08-9f0e-6a64845f1e30', 'f426836a-979e-4ee9-a833-5e61b2fa51f4', '1d53582b-2f66-43c4-8eb6-dc7df68bbd86', '2026-02-15', '[{\"name\":\"Lisinopril 10mg\",\"dosage\":\"1 tablet in morning\",\"duration\":\"Ongoing\"}]', 'Monitor blood sugar.', '2026-02-26 05:57:40'),
('8f758922-595d-42ad-a147-7c3547caa9c0', '478a6df8-0f0c-49e5-95f5-06a0d6800428', '26ac639e-4c6a-4975-a4cf-8f8d7cdd7f10', '2026-02-16', '[{\"name\":\"Metronidazole 400mg\",\"dosage\":\"1 tablet 3 times daily\",\"duration\":\"7 days\"}]', 'Avoid alcohol during treatment.', '2026-02-26 05:57:40'),
('a133fdfc-8ac8-4d24-abc1-26ad29041cc1', '4551a367-9be9-45e6-be86-fb76c96fe070', 'ae7e9612-816a-44d6-92e9-45c86a28fe0b', '2026-02-25', '[{\"name\":\"Aspirin 75mg\",\"dosage\":\"1 tablet daily\",\"duration\":\"Ongoing\"},{\"name\":\"Atorvastatin 20mg\",\"dosage\":\"1 tablet at night\",\"duration\":\"Ongoing\"}]', 'Reduce salt intake.', '2026-02-26 05:57:40'),
('bfafd171-1905-466a-b4ed-6a299091d346', '4551a367-9be9-45e6-be86-fb76c96fe070', '35c9cbb2-69e2-446d-b067-f76c7897fa76', '2026-02-20', '[{\"name\":\"Metformin 500mg\",\"dosage\":\"1 tablet twice daily\",\"duration\":\"Ongoing\"}]', 'Complete full course. Avoid alcohol.', '2026-02-26 05:57:40'),
('e550c264-e543-422c-84a5-b0721a93bf6a', '53474ce9-b3a7-41f3-9cb4-0ebde3ec0b7c', '1d53582b-2f66-43c4-8eb6-dc7df68bbd86', '2026-02-12', '[{\"name\":\"Ibuprofen 400mg\",\"dosage\":\"1 tablet 3 times daily\",\"duration\":\"3 days\"}]', 'Complete full course.', '2026-02-26 05:57:40'),
('ef86fd73-3ea9-4166-96f3-ef29580f8426', '60cf4afb-ab8a-4c8c-b5e4-864cf561f55e', '35c9cbb2-69e2-446d-b067-f76c7897fa76', '2026-02-11', '[{\"name\":\"Clopidogrel 75mg\",\"dosage\":\"1 tablet daily\",\"duration\":\"Ongoing\"}]', 'Monitor BP weekly.', '2026-02-26 05:57:40'),
('f331b7ab-7f32-4c7d-8a7b-afc63074285c', 'ae6b93bb-0aa6-47cc-9a38-8b6df2da8226', '639553b3-02ca-4ea5-a06b-ead51b5dd13b', '2026-02-26', '[{\"name\":\"aaa\",\"dosage\":\"aaa\",\"duration\":\"aaa\"},{\"name\":\"bbb\",\"dosage\":\"bbb\",\"duration\":\"bbb\"},{\"name\":\"aaaassad\",\"dosage\":\"sdasd\",\"duration\":\"asdasd\"}]', 'asdasdasd', '2026-02-26 06:23:42'),
('f9aa4f0a-88b6-4f75-afd3-c6be7e6ac269', 'af106a9e-575f-4385-a5b3-753296bd40d1', '119a3252-5ed7-419f-9a8a-1e5102e1c6ac', '2026-02-22', '[{\"name\":\"Azithromycin 500mg\",\"dosage\":\"1 tablet daily\",\"duration\":\"3 days\"}]', 'Cardiac care. Monitor BP regularly.', '2026-02-26 05:57:40');

-- --------------------------------------------------------

--
-- Table structure for table `specializations`
--

CREATE TABLE `specializations` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `specializations`
--

INSERT INTO `specializations` (`id`, `name`) VALUES
(2, 'Cardiologist'),
(4, 'Dermatologist'),
(9, 'ENT Specialist'),
(1, 'General Physician'),
(8, 'Gynecologist'),
(5, 'Neurologist'),
(10, 'Ophthalmologist'),
(6, 'Orthopedist'),
(3, 'Pediatrician'),
(7, 'Psychiatrist'),
(12, 'Rheumatologist'),
(11, 'Urologist');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` varchar(36) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('patient','doctor','admin') NOT NULL,
  `name` varchar(255) NOT NULL,
  `nic` varchar(20) DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `address` text DEFAULT NULL,
  `specialization` varchar(100) DEFAULT NULL,
  `hospital_id` int(11) DEFAULT NULL,
  `license_no` varchar(50) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `profile_image` varchar(512) DEFAULT NULL,
  `email_verified` tinyint(1) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `email`, `password`, `role`, `name`, `nic`, `phone`, `address`, `specialization`, `hospital_id`, `license_no`, `created_at`, `updated_at`, `profile_image`, `email_verified`) VALUES
('02bae247-f61d-433c-baab-8aa8d9d2e97e', 'sithara@test.com', '$2a$10$iPCCd3TN93LCTMBqdxj1VOOYNbvnuiXcU6VOG3PanYPw5xBu.LftK', 'patient', 'Sithara Fernando', '199512345679', '0762345678', '78, Main Street, Galle', NULL, NULL, NULL, '2026-02-26 05:57:38', '2026-02-26 05:57:38', NULL, 0),
('04701b24-1a34-11f1-9fac-00e04c439e27', 'kilua6807@gmail.com', '$2a$10$XpzWEPJahm4F7cawLwVQtuIvxIZ8Xx2BK6f6aC.ozaSQnSp12MRn.', 'patient', 'Kilua', '200231410035', '0761340571', 'Pallai town , jaffna', NULL, NULL, NULL, '2026-03-07 14:43:35', '2026-03-07 15:04:29', NULL, 1),
('0dd05f11-849c-4a79-b409-10440c95d7b9', 'dinesh@test.com', '$2a$10$AA52N3oM2WvkeCs3xa1Z7eTGTxNLWErOuBMIw6r60/MMlY7CprGoC', 'patient', 'Dinesh Ranawaka', '199201345678', '0761234568', '44, Market Road, Colombo 11', NULL, NULL, NULL, '2026-02-26 05:57:39', '2026-02-26 05:57:39', NULL, 0),
('119a3252-5ed7-419f-9a8a-1e5102e1c6ac', 'dr.samanthi@test.com', '$2a$10$puNZ/pg5CvllAtBpfl6kk.jGjlm4Bi2xtzSS574SIhTJVQbpS.XfW', 'doctor', 'Dr. Samanthi Wijesinghe', NULL, NULL, NULL, 'Dermatologist', 2, 'GMC-SL-004', '2026-02-26 05:57:40', '2026-02-26 05:57:40', 'https://i.pravatar.cc/300?u=dr.samanthi%40test.com', 0),
('11a2ba23-7796-4564-a6bc-d03c93dc4dba', 'kamal@test.com', '$2a$10$wBCvxbAHCvuOjzsqzBpCkOYNQW5OZbU.mTRiS9RIKD3GTD/9IKss2', 'patient', 'Kamal Silva', '198567890123', '0719876543', '12, Temple Street, Kandy', NULL, NULL, NULL, '2026-02-26 05:57:38', '2026-02-26 05:57:38', NULL, 0),
('1a4e32fb-d58b-440e-bd5a-2f2d9cd14bae', 'shiranthi@test.com', '$2a$10$6QAzy6WFw6gQr8./5jELsOQ9Q5DtLrsAglkMIw.NU7JSFQ.TyLDPW', 'patient', 'Shiranthi De Silva', '199089012345', '0728901234', '11, Temple Road, Kandy', NULL, NULL, NULL, '2026-02-26 05:57:39', '2026-02-26 05:57:39', NULL, 0),
('1d53582b-2f66-43c4-8eb6-dc7df68bbd86', 'dr.rani@test.com', '$2a$10$CPv4DmmAf6EZYHZNcqwpB.wT7n9sQ6pg2Ar/w48IaKrHm8HKGMTxm', 'doctor', 'Dr. Rani Fernando', NULL, NULL, NULL, 'Cardiologist', 2, 'GMC-SL-002', '2026-02-26 05:57:39', '2026-02-26 05:57:39', 'https://i.pravatar.cc/300?u=dr.rani%40test.com', 0),
('26ac639e-4c6a-4975-a4cf-8f8d7cdd7f10', 'dr.mahinda@test.com', '$2a$10$oPxWRg9JA2D6/fTr5aCObuSaKt5P/Lb4afZEYlOimP4tb4eUhz21.', 'doctor', 'Dr. Mahinda Rathnayake', NULL, NULL, NULL, 'Urologist', 6, 'GMC-SL-011', '2026-02-26 05:57:40', '2026-02-26 05:57:40', 'https://i.pravatar.cc/300?u=dr.mahinda%40test.com', 0),
('2d70a4ef-c156-4b82-8f7e-3dc0bd2cb615', 'lalitha@test.com', '$2a$10$rK5n/UAMydJdMW1k/i5j2uTRo6N/UxuhImLbSD0KfJYtJ267ahsXW', 'patient', 'Lalitha Herath', '199404678901', '0764567891', '33, Garden Road, Colombo 04', NULL, NULL, NULL, '2026-02-26 05:57:39', '2026-02-26 05:57:39', NULL, 0),
('35c9cbb2-69e2-446d-b067-f76c7897fa76', 'dr.sameera@test.com', '$2a$10$wt0yTQinIKG3zOm1OQJJK.5.medSA/FyIDa0oeSg2zj9kx795Z/u6', 'doctor', 'Dr. Sameera Jayakody', NULL, NULL, NULL, 'ENT Specialist', 5, 'GMC-SL-009', '2026-02-26 05:57:40', '2026-02-26 05:57:40', 'https://i.pravatar.cc/300?u=dr.sameera%40test.com', 0),
('40041a66-3092-453a-b54e-130f1dbed1d3', 'rohan@test.com', '$2a$10$1Klc8i9McYhfu4G12tgIYuHq6/wrQdBuVuVa1NQPcss786cQSzId6', 'patient', 'Rohan Jayasinghe', '199234567890', '0723456789', '23, Park Road, Colombo 07', NULL, NULL, NULL, '2026-02-26 05:57:38', '2026-02-26 05:57:38', NULL, 0),
('410e8ecb-1726-4283-9644-a48865e6e530', 'chamara@test.com', '$2a$10$ztc9f6.PXeGe/pKN0tIgC.rIpO3GS0qeqDv4yPf0TrjM8Rl8YvLsq', 'patient', 'Chamara Gunawardena', '199345678901', '0715678901', '9, Beach Road, Galle', NULL, NULL, NULL, '2026-02-26 05:57:38', '2026-02-26 05:57:38', NULL, 0),
('4551a367-9be9-45e6-be86-fb76c96fe070', 'patient@test.com', '$2a$10$g3QbtRmuLJ8Il5ukeU.I7OX1ZhYoGK.vmEKf0hZYmPF8ffjKrpe6i', 'patient', 'Nimal Perera', '199012345678', '0771234567', '45, Galle Road, Colombo 03', NULL, NULL, NULL, '2026-02-26 05:57:38', '2026-02-26 05:57:38', NULL, 0),
('478a6df8-0f0c-49e5-95f5-06a0d6800428', 'nadini@test.com', '$2a$10$HioyBHDoIjeOcR4UBUISWOWCIxS.4fjDicPsyrmuouKuKOgjsoG9u', 'patient', 'Nadini Jayawardena', '199302456789', '0772345679', '5, School Lane, Galle', NULL, NULL, NULL, '2026-02-26 05:57:39', '2026-02-26 05:57:39', NULL, 0),
('4d9e9ea6-78aa-47d7-bb56-682086539dd6', 'dr.nishantha@test.com', '$2a$10$zYK.9Skrt/2H6fiEve7msuBgOFPYBWhkhG4qmTed3JWtmfKx40RNq', 'doctor', 'Dr. Nishantha Bandara', NULL, NULL, NULL, 'Neurologist', 3, 'GMC-SL-005', '2026-02-26 05:57:40', '2026-02-26 05:57:40', 'https://i.pravatar.cc/300?u=dr.nishantha%40test.com', 0),
('53474ce9-b3a7-41f3-9cb4-0ebde3ec0b7c', 'chandrika@test.com', '$2a$10$//BoPKIOXpcL/.5236ZW8ekyHxAcFfRxKSVB4s9wLhSCEEZEcVEtW', 'patient', 'Chandrika Abeywickrama', '198701234567', '0770123456', '22, Main St, Anuradhapura', NULL, NULL, NULL, '2026-02-26 05:57:39', '2026-02-26 05:57:39', NULL, 0),
('60cf4afb-ab8a-4c8c-b5e4-864cf561f55e', 'dilini@test.com', '$2a$10$3O4tulGlOakN0Z.vYmuYoe7jTZ5.WezXw4TtOZyHEW5fA./liti2K', 'patient', 'Dilini Perera', '199678901234', '0766789012', '34, Station Road, Gampaha', NULL, NULL, NULL, '2026-02-26 05:57:38', '2026-02-26 05:57:38', NULL, 0),
('639553b3-02ca-4ea5-a06b-ead51b5dd13b', 'rasakumarvivekan@gmail.com', '$2a$10$vgoRJ/uSIYlqZ0Q98m2RJeXb9sl5Y0yDi9uVsIJJqiFHE1rPjDCPG', 'doctor', 'Dr. vivekan', NULL, NULL, NULL, 'ENT Specialist', 11, '1111', '2026-02-26 06:08:46', '2026-02-26 06:09:15', 'http://localhost:3001/uploads/639553b3-02ca-4ea5-a06b-ead51b5dd13b-1772086155669.jpg', 0),
('63d90282-f47e-4efd-85a7-ac6c5df67b11', 'dr.chamari@test.com', '$2a$10$nDuz8mK/ep8ZB558//hm.OWKKo.93M7tU6gYNC8b3glk2nw15Znnu', 'doctor', 'Dr. Chamari Gunawardena', NULL, NULL, NULL, 'Psychiatrist', 2, 'GMC-SL-008', '2026-02-26 05:57:40', '2026-02-26 05:57:40', 'https://i.pravatar.cc/300?u=dr.chamari%40test.com', 0),
('66f7d975-d975-4f66-9e16-2f8d0de9e1f0', 'dr.nadeeka@test.com', '$2a$10$1h.oAhGDdc36njScJWS3p.jpLo79AQYr0OMKznlpJ5contoiu0gjK', 'doctor', 'Dr. Nadeeka Silva', NULL, NULL, NULL, 'Rheumatologist', 4, 'GMC-SL-012', '2026-02-26 05:57:40', '2026-02-26 06:07:16', 'http://localhost:3001/uploads/66f7d975-d975-4f66-9e16-2f8d0de9e1f0-1772086034594.jpg', 0),
('699c77d2-43b5-4244-971f-81c13046e52f', 'dr.ruwan@test.com', '$2a$10$oix4Ia9IBYvF6qH7dROClecK9KhNj.8jSwcDAEUt3z7MDkjxpxkZy', 'doctor', 'Dr. Ruwan Senanayake', NULL, NULL, NULL, 'Orthopedist', 4, 'GMC-SL-007', '2026-02-26 05:57:40', '2026-02-26 05:57:40', 'https://i.pravatar.cc/300?u=dr.ruwan%40test.com', 0),
('6c28d8f3-9bcd-4fa2-ab59-7d569e03ad5e', 'doctor@test.com', '$2a$10$8v3pEm7f3D4f8Rbk4eMQQeApDi4dfhzAg3/0KlkG.5AbS6m3/x9B2', 'doctor', 'Dr. Sunil Jayawardena', NULL, NULL, NULL, 'General Physician', 1, 'GMC-SL-001', '2026-02-26 05:57:39', '2026-02-26 05:57:39', 'https://i.pravatar.cc/300?u=doctor%40test.com', 0),
('6d3b380c-81c6-4901-bcc4-5bdd4270d270', 'dr.nimalperera@gmail.com', '$2a$10$1ZnInYOjXlzn/FqXIOa2ae.aTCv5cuF/cxTL9ZzSILafXG3zg1vTy', 'doctor', 'Dr. Nimal Perera', NULL, NULL, NULL, 'ENT Specialist', 10, 'SLMC-45872', '2026-03-07 15:07:21', '2026-03-07 15:07:21', NULL, 0),
('8128c1de-18a3-11f1-bf87-00e04c439e27', 'vivekanv93@gmail.com', '$2a$10$MZDpCWaPIIBea62kAGHe2eMV4/x1vOHiDtPzByvJdHMKWpRkZDcuu', 'patient', 'Vivekan Vivek', '200231410038', '0756393038', 'Kucham Lane', NULL, NULL, NULL, '2026-03-05 14:56:35', '2026-03-05 14:57:36', NULL, 1),
('86623220-6c3b-40f5-bc9b-197c6d0fed9b', 'admin@test.com', '$2a$10$4rQ2ZeCsxR8GxsZIjplrCes.tVRQ6a5U0gjqHvP23n6lAmOUh2pUq', 'admin', 'System Administrator', NULL, NULL, NULL, NULL, NULL, NULL, '2026-02-26 05:57:38', '2026-02-26 05:57:38', NULL, 0),
('8e3642c6-f010-4291-9b51-26afc80c35e6', 'admin2@test.com', '$2a$10$AMb6Gsm7.NkdHHbU4DIiquDwZYDXYFZOeKvPGztsvUMidPqsoW2Cq', 'admin', 'Admin User Two', NULL, NULL, NULL, NULL, NULL, NULL, '2026-02-26 05:57:38', '2026-02-26 05:57:38', NULL, 0),
('a5a1e120-0cf9-4c42-a4d8-e79bc3b955e1', 'dr.ajith@test.com', '$2a$10$.GbDg33WqaANjKLRANbSduqrvV16hOGjXoiaSxgGHVcTAn.1gGnta', 'doctor', 'Dr. Ajith De Silva', NULL, NULL, NULL, 'Pediatrician', 1, 'GMC-SL-003', '2026-02-26 05:57:39', '2026-02-26 06:03:38', 'https://i.pravatar.cc/300?u=dr.ajith%40test.com', 0),
('ae6b93bb-0aa6-47cc-9a38-8b6df2da8226', 'anuradha@test.com', '$2a$10$KOD44hTiMId1HUwWBs32nelixyv6o91XSOVQ46uHcU6rMFPW0xYH6', 'patient', 'Anuradha Senanayake', '198803567890', '0713456780', '77, Hill Street, Kandy', NULL, NULL, NULL, '2026-02-26 05:57:39', '2026-02-26 05:57:39', NULL, 0),
('ae7e9612-816a-44d6-92e9-45c86a28fe0b', 'dr.dilani@test.com', '$2a$10$VZdCpbYNR/mZdpj6/85zsesczs51v64cCchCj7e9XsW0A7T2uSfvG', 'doctor', 'Dr. Dilani Perera', NULL, NULL, NULL, 'Gynecologist', 1, 'GMC-SL-006', '2026-02-26 05:57:40', '2026-02-26 05:57:40', 'https://i.pravatar.cc/300?u=dr.dilani%40test.com', 0),
('af106a9e-575f-4385-a5b3-753296bd40d1', 'nadeesha@test.com', '$2a$10$WdHwjkA5mN1YgeIAFG1IU.WQ7A70aYLNF790WlVRXicQgof8nxW5a', 'patient', 'Nadeesha Wijeratne', '198812345680', '0774567890', '56, Lake Road, Kandy', NULL, NULL, NULL, '2026-02-26 05:57:38', '2026-02-26 05:57:38', NULL, 0),
('df7202cd-f47e-48c5-8624-1cff3cc21ea7', 'prasanna@test.com', '$2a$10$479BWt35.tvC.VJjqeUAZeQoY8p2aXukIqHWEjyta5xK2Ce8fVdxu', 'patient', 'Prasanna Rajapaksa', '198956789012', '0777890123', '67, Hospital Lane, Matara', NULL, NULL, NULL, '2026-02-26 05:57:39', '2026-02-26 05:57:39', NULL, 0),
('f1c0e86d-a031-4a1a-9ab3-9eecd2aefeb9', 'dr.thushari@test.com', '$2a$10$nZcJXlFZ4oi5rQ3hvmJKDeUMWYmHk9N7RsF.BqlIRQFpkvsPyyY8K', 'doctor', 'Dr. Thushari Abeywickrama', NULL, NULL, NULL, 'Ophthalmologist', 3, 'GMC-SL-010', '2026-02-26 05:57:40', '2026-02-26 05:57:40', 'https://i.pravatar.cc/300?u=dr.thushari%40test.com', 0),
('f426836a-979e-4ee9-a833-5e61b2fa51f4', 'sanka@test.com', '$2a$10$P.k6S7aWvgPvbolJerzIv.Z8v.71uJQqJoXFZrrRXQtR8s80C/LkK', 'patient', 'Sanka Dissanayake', '199190123456', '0719012345', '89, Old Town, Jaffna', NULL, NULL, NULL, '2026-02-26 05:57:39', '2026-02-26 05:57:39', NULL, 0);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `appointments`
--
ALTER TABLE `appointments`
  ADD PRIMARY KEY (`id`),
  ADD KEY `patient_id` (`patient_id`),
  ADD KEY `doctor_id` (`doctor_id`),
  ADD KEY `hospital_id` (`hospital_id`);

--
-- Indexes for table `doctor_schedules`
--
ALTER TABLE `doctor_schedules`
  ADD PRIMARY KEY (`id`),
  ADD KEY `doctor_id` (`doctor_id`);

--
-- Indexes for table `email_verification_codes`
--
ALTER TABLE `email_verification_codes`
  ADD PRIMARY KEY (`email`);

--
-- Indexes for table `hospitals`
--
ALTER TABLE `hospitals`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `medical_records`
--
ALTER TABLE `medical_records`
  ADD PRIMARY KEY (`id`),
  ADD KEY `patient_id` (`patient_id`);

--
-- Indexes for table `password_reset_codes`
--
ALTER TABLE `password_reset_codes`
  ADD PRIMARY KEY (`email`);

--
-- Indexes for table `prescriptions`
--
ALTER TABLE `prescriptions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `patient_id` (`patient_id`),
  ADD KEY `doctor_id` (`doctor_id`);

--
-- Indexes for table `specializations`
--
ALTER TABLE `specializations`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `doctor_schedules`
--
ALTER TABLE `doctor_schedules`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- AUTO_INCREMENT for table `hospitals`
--
ALTER TABLE `hospitals`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `specializations`
--
ALTER TABLE `specializations`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `appointments`
--
ALTER TABLE `appointments`
  ADD CONSTRAINT `appointments_ibfk_1` FOREIGN KEY (`patient_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `appointments_ibfk_2` FOREIGN KEY (`doctor_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `appointments_ibfk_3` FOREIGN KEY (`hospital_id`) REFERENCES `hospitals` (`id`);

--
-- Constraints for table `doctor_schedules`
--
ALTER TABLE `doctor_schedules`
  ADD CONSTRAINT `doctor_schedules_ibfk_1` FOREIGN KEY (`doctor_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `medical_records`
--
ALTER TABLE `medical_records`
  ADD CONSTRAINT `medical_records_ibfk_1` FOREIGN KEY (`patient_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `prescriptions`
--
ALTER TABLE `prescriptions`
  ADD CONSTRAINT `prescriptions_ibfk_1` FOREIGN KEY (`patient_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `prescriptions_ibfk_2` FOREIGN KEY (`doctor_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
