-- ============================================================
-- GUESS ENERGY + SARL — Tables additives (création idempotente)
-- Ces tables appartiennent UNIQUEMENT au site web.
-- Toutes les tables métier GesCom restent gérées par GesCom.
-- Mode d'emploi : npx prisma db execute --file ./sql/web_tables.sql
-- ============================================================

IF OBJECT_ID(N'Web_Devis', N'U') IS NULL
BEGIN
    CREATE TABLE Web_Devis (
        id_devis     INT IDENTITY(1,1) PRIMARY KEY,
        reference    NVARCHAR(50)  NOT NULL,
        id_tenant    INT           NOT NULL,
        id_boutique  INT           NULL,
        nom          NVARCHAR(150) NOT NULL,
        telephone    NVARCHAR(50)  NOT NULL,
        email        NVARCHAR(150) NOT NULL,
        entreprise   NVARCHAR(150) NULL,
        commentaire  NVARCHAR(MAX) NULL,
        statut       NVARCHAR(30)  NOT NULL CONSTRAINT DF_Web_Devis_statut DEFAULT 'NOUVEAU',
        items_json   NVARCHAR(MAX) NULL,
        created_at   DATETIME2     NOT NULL CONSTRAINT DF_Web_Devis_created DEFAULT SYSUTCDATETIME()
    );

    CREATE UNIQUE INDEX UQ_Web_Devis_reference ON Web_Devis (reference);
    CREATE INDEX IX_Web_Devis_tenant ON Web_Devis (id_tenant);
END;

IF OBJECT_ID(N'Web_Contact', N'U') IS NULL
BEGIN
    CREATE TABLE Web_Contact (
        id_message  INT IDENTITY(1,1) PRIMARY KEY,
        id_tenant   INT           NOT NULL,
        id_boutique INT           NULL,
        nom         NVARCHAR(150) NOT NULL,
        email       NVARCHAR(150) NOT NULL,
        telephone   NVARCHAR(50)  NULL,
        sujet       NVARCHAR(100) NOT NULL,
        message     NVARCHAR(MAX) NOT NULL,
        created_at  DATETIME2     NOT NULL CONSTRAINT DF_Web_Contact_created DEFAULT SYSUTCDATETIME()
    );

    CREATE INDEX IX_Web_Contact_tenant ON Web_Contact (id_tenant);
END;