DELETE FROM Tower;
INSERT INTO Tower (id, towerName, attackPower, attackSpeed, attackRange, attackType, towerPrice, sellPriceRate, upgradeAttackPower, upgradePrice)
values (1, "원거리 타워", 150, 1500, 500, "singleAttack", 1000, 0.5, 40, 500);
INSERT INTO Tower (id, towerName, attackPower, attackSpeed, attackRange, attackType, towerPrice, sellPriceRate, upgradeAttackPower, upgradePrice)
values (2,"화염 타워", 30, 2500, 700, "multiAttack", 1600, 0.55, 20, 700);
INSERT INTO Tower (id, towerName, attackPower, attackSpeed, attackRange, attackType, towerPrice, sellPriceRate, upgradeAttackPower, upgradePrice)
values (3,"치유 타워", 200, 1000, 0, "heal", 2000,  0.6, 50, 800);



