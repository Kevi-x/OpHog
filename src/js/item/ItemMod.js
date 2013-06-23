( function() {

    /**
     * Types of item mods.
     */
    window.game.ItemModType = {
        LIFE_LEECH: 'life leech',
        THORNS: 'thorns',
        REDUCE_DAMAGE: 'reduce damage',
        MULTIPLE_PROJECTILES: 'multiple projectiles'
    };
  
    /**
     * ItemMod base-class constructor.
     * @param {game.ItemModType} type - the type of the mod
     */
    window.game.ItemMod = function ItemMod(type) {
        this.type = type;
    };

    /**
     * This is called right before the damage is dealt, and can actually modify
     * that damage amount.
     * @param  {Unit} attacker        - the unit who attacked
     * @param  {Unit} target          - the target that was attacked
     * @param  {Number} damageToBeDealt - the damage that will be dealt.
     * @return {Number}                 - the damage that will be dealt. You
     * need to return this even if you don't modify it.
     */
    window.game.ItemMod.prototype.beforeReceiveDamage = function(attacker, target, damageToBeDealt) { return damageToBeDealt };

    /**
     * This is called when you deal damage. It CANNOT modify the damage dealt
     * since that was already computed.
     * @param  {Unit} attacker    - the unit who attacked
     * @param  {Unit} target      - the target that was attacked
     * @param  {Number} damageDealt - the damage dealt. This can't exceed
     * whatever the target's life was before it was hit, so if the target has 40
     * life and you hit it for 100, this function will only be passed 40.
     * @return {undefined}
     */
    window.game.ItemMod.prototype.onDamageDealt = function(attacker, target, damageDealt) {};

    /**
     * This is called when you receive damage. It cannot modify the damage
     * received since the target's life will already have been modified.
     *
     * Same args/return as onDamageDealt (so see that function for comments).
     */
    window.game.ItemMod.prototype.onDamageReceived = function(attacker, target, damageDealt) {};

    /**
     * This function can modify your actual attack. Only one mod is allowed to
     * do this, although they're all allowed to TRY (e.g. if you have three mods
     * and each one has a chance to modify it, then they can all attempt that
     * chance).
     * 
     * @param  {Unit} attacker - the attacker
     * @return {Boolean}          true if the attack was modified.
     */
    window.game.ItemMod.prototype.onBattleTurn = function(attacker) { return false; };

    /**
     * @return {ItemMod} a copy of this mod
     */
    window.game.ItemMod.prototype.copy = function() {
        console.log('copy - unimplemented for: ' + this.type);
        return null;
    };

    /**
     * @return {String} a description of this mod
     */
    window.game.ItemMod.prototype.getDescription = function() {
        console.log('getDescription - unimplemented for: ' + this.type);
        return 'Unrecognized ItemMod type: ' + this.type;
    };

    /**
     * This function takes in mods (as Objects) from localStorage and will turn
     * them back into their original classes.
     *
     * It may be a better design to put this function in each mod itself.
     * @param  {Array:Object} mods - the mods you loaded
     * @return {Array:ItemMod}      - the mods as their real objects
     */
    window.game.ItemMod.rehydrateMods = function(mods) {
        var finalMods = [];
        for (var i = 0; i < mods.length; i++) {
            var modObject = mods[i];
            var finalMod;
            var itemModType = modObject.type;
            switch( itemModType ) {
                case game.ItemModType.LIFE_LEECH:
                    finalMod = new game.LifeLeech(modObject.chanceToLeech, modObject.leechPercentage);
                    break;
                case game.ItemModType.THORNS:
                    finalMod = new game.Thorns(modObject.thornsDamage);
                    break;
                case game.ItemModType.REDUCE_DAMAGE: 
                    finalMod = new game.ReduceDamage(modObject.reduceDamageAmount);
                    break;
                case game.ItemModType.MULTIPLE_PROJECTILES: 
                    finalMod = new game.MultipleProjectiles(modObject.numberOfProjectiles);
                    break;
                default:
                    finalMod = null;
                    console.log('Unrecognized ItemModType: ' + itemModType);
                    break;
            };

            if ( finalMod != null ) {
                finalMods.push(finalMod);
            }
        };

        return finalMods;
    };

}());