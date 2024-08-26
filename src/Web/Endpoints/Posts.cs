
using Application.Bookmarks.Commands.BookmarkPost;
using Application.Bookmarks.Commands.UnBookmarkPost;
using Application.Bookmarks.Queries.GetBookmarkInfo;
using Application.Common.Models;
using Application.Posts.Commands.CreatePost;
using Application.Posts.Commands.LikePost;
using Application.Posts.Commands.RemovePost;
using Application.Posts.Commands.UnlikePost;
using Application.Posts.Queries;
using Application.Posts.Queries.GetBookmarkPostWithPagination;
using Application.Posts.Queries.GetFollowingPostWithPagination;
using Application.Posts.Queries.GetLikeInfo;
using Application.Posts.Queries.GetPostFeedWithPagination;
using Application.Posts.Queries.GetPostInfo;
using Application.Posts.Queries.GetUserPostWithPagination;
using Application.Posts.Queries.GetUserTaggedPostWithPagination;
using Application.Posts.Queries.SearchPostByQueryWithPagination;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using WebApi.Infrastructure;

namespace WebApi.Endpoints
{
    public class Posts : EndpointGroupBase
    {
        public override void Map(WebApplication app)
        {
            app.MapGroup(this)
                .RequireAuthorization()
                .MapGet(SearchPostByQueryWithPagination,"search")
                .MapGet(GetPostFeedWithPagination,"for-you")
                .MapGet(GetFollowingPostWithPagination,"following")
                .MapGet(GetBookmarkPostWithPagination,"bookmarks")
                .MapGet(GetUserPostWithPagination,"user")
                .MapGet(GetUserTaggedPostWithPagination,"tagged")
                .MapGet(GetTrendingTags,"trending")
                .MapGet(GetPostInfo,"{id}")
                .MapPost(CreatePost)
                .MapDelete(RemovePost,"{id}")
                .MapGet(GetLikeInfo,"{id}/like")
                .MapPost(LikePost,"{id}/like")
                .MapDelete(UnlikePost,"{id}/like")
                .MapGet(GetBookmarkInfo,"{id}/bookmark")
                .MapPost(BookmarkPost,"{id}/bookmark")
                .MapDelete(UnBookmarkPost,"{id}/bookmark");
        }

        public Task<PaginatedList<PostDto>> SearchPostByQueryWithPagination
        (ISender sender, [AsParameters] SearchPostByQueryWithPaginationQuery query) => sender.Send(query);

        public Task<PaginatedList<PostDto>> GetPostFeedWithPagination
        (ISender sender, [AsParameters] GetPostFeedWithPaginationQuery query) => sender.Send(query);

        public Task<PaginatedList<PostDto>> GetFollowingPostWithPagination
        (ISender sender, [AsParameters] GetFollowingPostWithPaginationQuery query) => sender.Send(query);

        public Task<PaginatedList<PostDto>> GetBookmarkPostWithPagination
        (ISender sender, [AsParameters] GetBookmarkPostWithPaginationQuery query) => sender.Send(query);

        public Task<PaginatedList<PostDto>> GetUserPostWithPagination
        (ISender sender, [AsParameters] GetUserPostWithPaginationQuery query) => sender.Send(query);

        public Task<PaginatedList<PostDto>> GetUserTaggedPostWithPagination
        (ISender sender, [AsParameters] GetUserTaggedPostWithPaginationQuery query) => sender.Send(query);

        public Task<IEnumerable<TrendingTag>> GetTrendingTags
        (ISender sender, [AsParameters] GetTrendingTagQuery query) => sender.Send(query);

        public Task<PostDto> CreatePost(ISender sender, [FromBody] CreatePostCommand command) => sender.Send(command);

        public Task<PostDto> RemovePost(ISender sender, [FromRoute] string id)
        => sender.Send(new RemovePostCommand(){PostId = id});

        public Task<PostDto> GetPostInfo(ISender sender, [FromRoute] string id)
        => sender.Send(new GetPostInfoQuery(){PostId = id});

        public Task<LikeInfo> GetLikeInfo(ISender sender, [AsParameters] GetLikeInfoQuery query) => sender.Send(query);

        public Task LikePost(ISender sender, [FromRoute] string id)
        => sender.Send(new LikePostCommand(){PostId = id});

        public Task UnlikePost(ISender sender, [FromRoute] string id) =>
        sender.Send(new UnlikePostCommand(){PostId = id});

        public Task<BookmarkInfo> GetBookmarkInfo(ISender sender, [AsParameters] GetBookmarkInfoQuery query)
        => sender.Send(query);

        public Task BookmarkPost(ISender sender, [FromRoute] string  id)
        => sender.Send(new BookmarkPostCommand(){PostId = id});

        public Task UnBookmarkPost(ISender sender, [FromRoute] string id)
        => sender.Send(new UnBookmarkPostCommand(){PostId = id});
    }
}