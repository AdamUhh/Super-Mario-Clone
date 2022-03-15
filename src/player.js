import Entity from "./Entity";
import Player from "./traits/Player";
import PlayerController from "./traits/PlayerController";

export function createPlayerEnvironment(playerEntity) {
  // ? creating an instance of playerController, and telling it which
  // ? entity to track as well as the revival coordinates/checkpoint
  const playerControl = new PlayerController();
  playerControl.checkpoint.set(64, 64);
  playerControl.setPlayer(playerEntity);

  // ? a (pointless/useless) entity on the level (to keep track of mario and revive/add to level)
  const playerEnv = new Entity();
  playerEnv.addTrait(playerControl);

  return playerEnv;
}

export function createPlayer(entity) {
  entity.addTrait(new Player());
  return entity;
}

export function* findPlayers(level) {
  // ? find mario inside of the level, to get his data, such as position
  for (const entity of level.entities) {
    if (entity.player) {
      // ? if the entity is a 'player'
      yield entity;
    }
  }
}
