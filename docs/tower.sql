-- INSERT INTO Tower (towerName, attackPower, attackSpeed, attackRange, attackType, towerPrice, sellPriceRate, upgradeAttackPower, upgradePrice)
-- values ("단일공격 타워", 80, 2000, 500, "singleAttack", 1000, 0.5, 20, 500);
INSERT INTO Tower (towerName, attackPower, attackSpeed, attackRange, attackType, towerPrice, sellPriceRate, upgradeAttackPower, upgradePrice)
values ("다중공격 타워", 70, 2500, 600, "multiAttack", 1200, 0.55, 15, 600);
INSERT INTO Tower (towerName, attackPower, attackSpeed, attackRange, attackType, towerPrice, sellPriceRate, upgradeAttackPower, upgradePrice)
values ("힐 타워", 60, 4000, 0, "heal", 1500,  0.6, 15, 700);

-- DROP TABLE Tower;

