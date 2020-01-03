const { RESTDataSource } = require('apollo-datasource-rest');

class MusicAPI extends RESTDataSource {
    constructor() {
        super();
        this.baseURL = 'http://localhost/api';
    }

    async getAllBands() {
        const response = await this.get('bands');
        return Array.isArray(response) ?
            response.map(band => this.bandReducer(band)) : [];
    }
    async getBandById({ bandId }) {
        const response = await this.get('bands/' + bandId);
        return this.bandReducer(response);
    }
    getBandsByIds({ bandsIds }) {
        return Promise.all(
            bandsIds.map(bandId => this.getBandById({ bandId })),
        );
    }
    async deleteBand({ bandId }) {
        try {
            const response = await this.delete('bands/' + bandId);
            return {
                success: true,
                message: 'band of id ' + bandId + ' has been deleted.',
            }
        } catch (err) {
            return {
                success: false,
                message: 'band of id ' + bandId + ' does not exist',
            }
        }
    }
    async deleteBand({ bandId }) {
        try {
            const response = await this.delete('bands/' + bandId);
            return {
                success: true,
                message: 'band of id ' + bandId + ' has been deleted.',
            }
        } catch (err) {
            return {
                success: false,
                message: 'band of id ' + bandId + ' does not exist',
            }
        }
    }
    async addBand({ name, style, formedIn }) {
        const response = await this.post('bands', { name: name, style: style, formedIn: formedIn });
        return this.bandReducer(response);
    }

    async getMusicians() {
        const response = await this.get('musicians');
        return Array.isArray(response) ?
            response.map(musician => this.musicianReducer(musician)) : []
    }
    async getMusicianById({ musicianId }) {
        const response = await this.get('musicians/' + musicianId);
        return this.musicianReducer(response);
    }
    async getMusiciansByBand({ bandId }) {
        const response = await this.get('musicians');
        const filterResponse = response.filter(musician => {
            return musician.band_id == bandId;
        });
        return Array.isArray(filterResponse) ?
            filterResponse.map(musician => this.musicianReducer(musician)) : []
    }

    async deleteMusician({ musicianId }) {
        try {
            const response = await this.delete('musicians/' + musicianId);
            return {
                success: true,
                message: 'musician of id ' + musicianId + ' has been deleted.',
            }
        } catch (err) {
            return {
                success: false,
                message: 'musician of id ' + musicianId + ' does not exist',
            }
        }
    }
    async addMusician({ name, role }) {
        const response = await this.post('musicians', { name: name, role: role });
        return this.musicianReducer(response);
    }


    bandReducer(band) {
        return {
            id: band.id,
            name: band.name,
            style: band.style,
            formedIn: band.formedIn,
        }
    }
    musicianReducer(musician) {
        return {
            id: musician.id,
            name: musician.name,
            role: musician.role || "indefinido",
            band_id: musician.band_id,
        }
    }
}

module.exports = MusicAPI;