module.exports = {
    Query: {
        bands: (_, __, { dataSources }) =>
            dataSources.musicAPI.getAllBands(),
        band: (_, { id }, { dataSources }) =>
            dataSources.musicAPI.getBandById({ bandId: id }),
        musicians: (_, __, { dataSources }) =>
            dataSources.musicAPI.getMusicians(),
        musician: (_, { id }, { dataSources }) =>
            dataSources.musicAPI.getMusicianById({ musicianId: id }),
    },

    Band: {
        members: (band, __, { dataSources }) =>
            dataSources.musicAPI.getMusiciansByBand({ bandId: band.id }),
    },

    Musician: {
        band: (musician, __, { dataSources }) =>
            dataSources.musicAPI.getBandById({ bandId: musician.band_id }),
    },

    Mutation: {
        deleteBand: async(_, { bandId }, { dataSources }) => {
            const result = await dataSources.musicAPI.deleteBand({ bandId });
            return result;
        },
        deleteMusician: async(_, { musicianId }, { dataSources }) => {
            const result = await dataSources.musicAPI.deleteMusician({ musicianId });
            return result;
        },
        addBand: async(_, { name, style, formedIn }, { dataSources }) => {
            const result = await dataSources.musicAPI.addBand({ name, style, formedIn });
            return result;
        },
        addMusician: async(_, { name, role }, { dataSources }) => {
            const result = await dataSources.musicAPI.addMusician({ name, role });
            return result;
        }
    }
}