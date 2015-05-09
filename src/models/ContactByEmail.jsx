import {Collection} from "backbone-collection";

export default Collection.extend({
    getByEmail(em){
        var em = em.toLowerCase();
        return this.find(x => x.key.toLowerCase() === em)
    }
})