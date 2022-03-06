export default class EntityCollider {
    constructor(entities){
        // ? used to check whether entities are colliding with eachother
        this.entities = entities
    }
    
    check(subject) {
        // ? used to check whether entities are colliding with eachother
        this.entities.forEach(candidate => {
            if (subject === candidate) return

            // ? to check if we have a collision between any entities
            if (subject.bounds.overlaps(candidate.bounds)) {
                // ? remember, collides is first found in /Entity.js/
                subject.collides(candidate)
                candidate.collides(subject)

            }
        })
    }
}