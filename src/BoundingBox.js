export default class BoundingBox {
  constructor(pos, size, offset) {
    // ? this class is used to more easily get the entities boundaries
    // ? such as the entities top, botton, left, right
    // ? instead of using this.pos.y + this.size.y + this.offset.y in order to
    // ? get the bottom of the entity, all over /TileCollider.js/
    this.pos = pos;
    this.size = size;
    this.offset = offset;
  }

  overlaps(box) {
    // ? is mario overlapping with an (enemy) entity/candidate
    return (
      this.bottom > box.top &&
      this.top < box.bottom &&
      this.left < box.right &&
      this.right > box.left
    );
  }

  // ? 'get' allows you to directly do ex: 'entity.bounds.bottom' instead of 'entity.bounds.bottom()'
  get bottom() {
    return this.pos.y + this.size.y + this.offset.y;
  }
  // ? 'set' allows you to direct do ex: 'entity.bounds.bottom = match.y1' instead of 'entity.bounds.bottom(match.y1)'
  set bottom(y) {
    this.pos.y = y - (this.size.y + this.offset.y);
  }

  get top() {
    return this.pos.y + this.offset.y;
  }
  set top(y) {
    this.pos.y = y - this.offset.y;
  }

  get left() {
    return this.pos.x + this.offset.x;
  }
  set left(x) {
    this.pos.x = x - this.offset.x;
  }

  get right() {
    return this.pos.x + this.size.x + this.offset.x;
  }
  set right(x) {
    this.pos.x = x - (this.size.x + this.offset.x);
  }
}
