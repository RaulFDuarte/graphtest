const { RESTDataSource } = require('apollo-datasource-rest');

class RocketAPI extends RESTDataSource {
    constructor() {
        super();
        this.baseURL = 'https://api.spacexdata.com/v2/';
    }

    async getAllRockets() {
        const response = await this.get('rockets');
        return Array.isArray(response) ?
            response.map(rocket => this.rocketReducer(rocket)) : [];
    }

    async getRocketById({ rocketId }) {
        const response = await this.get('rockets/' + rocketId);
        return this.rocketReducer(response);
    }

    rocketReducer(rocket) {
        return {
            id: rocket.id,
            name: rocket.name,
            type: rocket.type,
            active: rocket.active,
            stages: rocket.stages,
            boosters: rocket.boosters
        }
    }
}



module.exports = RocketAPI;