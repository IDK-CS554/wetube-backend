const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLList,
  GraphQLSchema
} = require("graphql");
const { queryYT } = require("./api");

const Videos = results => {
  return results.map(r => ({
    videoId: r["id"]["videoId"],
    title: r["snippet"]["title"],
    thumbnails: r["snippet"]["thumbnails"]
  }));
};

const VideoType = new GraphQLObjectType({
  name: "Video",
  fields: () => ({
    title: { type: GraphQLString },
    videoId: { type: GraphQLString },
    thumbnails: { type: ThumbnailsType }
  })
});

const ThumbnailsType = new GraphQLObjectType({
  name: "Thumbnails",
  fields: () => ({
    default: { type: ImageType },
    medium: { type: ImageType },
    high: { type: ImageType }
  })
});

const ImageType = new GraphQLObjectType({
  name: "Image",
  fields: () => ({
    url: { type: GraphQLString },
    width: { type: GraphQLInt },
    height: { type: GraphQLInt }
  })
});

const RootQuery = new GraphQLObjectType({
  name: "RootQuery",
  fields: {
    videos: {
      type: new GraphQLList(VideoType),
      args: {
        q: { type: GraphQLString }
      },
      async resolve(parent, args) {
        const response = await queryYT(args.q);
        const videos = Videos(response);
        console.log(videos);
        return videos;
      }
    }
  }
});

module.exports = new GraphQLSchema({
  query: RootQuery
});
