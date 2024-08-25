
using Application.Comments.Commands.CreateComment;
using Application.Comments.Commands.CreateNestedComment;
using Application.Comments.Commands.LikeComment;
using Application.Comments.Commands.RemoveComment;
using Application.Comments.Commands.UnlikeComment;
using Application.Comments.Queries.GetCommentLikeInfo;
using Application.Comments.Queries.GetCommentNestedWithPagination;
using Application.Comments.Queries.GetCommentsPostWithPagination;
using Application.Common.Models;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using WebApi.Infrastructure;

namespace WebApi.Endpoints
{
    public class Comments : EndpointGroupBase
    {
        public override void Map(WebApplication app)
        {
            app.MapGroup(this)
                .RequireAuthorization()
                .MapGet(GetCommentPostWithPagination)
                .MapGet(GetCommentNestedWithPagination,"nested")
                .MapPost(CreateComment)
                .MapPost(CreateNestedComment,"nested")
                .MapDelete(RemoveComment,"{id}")
                .MapGet(GetCommentLikeInfo,"{id}/like")
                .MapPost(LikeComment,"{id}/like")
                .MapDelete(UnLikeComment,"{id}/like");
        }

        public Task<PaginatedList<CommentDto>> GetCommentPostWithPagination
        (ISender sender,[AsParameters] GetCommentsPostWithPaginationQuery query) => sender.Send(query);

        public Task<PaginatedList<CommentDto>> GetCommentNestedWithPagination
        (ISender sender,[AsParameters] GetCommentNestedWithPaginationQuery query) => sender.Send(query);

        public Task<CommentDto> CreateComment(ISender sender,[FromBody] CreateCommentCommand command)
        => sender.Send(command);

        public Task<CommentDto> CreateNestedComment(ISender sender,[FromBody] CreateNestedCommentCommand command)
        => sender.Send(command);

        public Task<CommentDto> RemoveComment(ISender sender,[FromRoute] string id)
        => sender.Send(new RemoveCommentCommand(){CommentId = id});

        public Task<LikeInfo> GetCommentLikeInfo(ISender sender,[FromRoute] string id)
        => sender.Send(new GetCommentLikeInfoQuery(){CommentId = id});

        public Task LikeComment(ISender sender,[FromRoute] string id)
        => sender.Send(new LikeCommentCommand(){CommentId = id});

        public Task UnLikeComment(ISender sender,[FromRoute] string id)
        => sender.Send(new UnlikeCommentCommand(){CommentId = id});
    }
}