
using Application.Common.Interfaces;
using Domain.Entities;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Diagnostics;

namespace Infrastructure
{
    public class ApplicationDbContext : IdentityDbContext<User>, IApplicationDbContext
    {
        public virtual DbSet<Bookmark> Bookmarks { get; set; }
        public virtual DbSet<Comment> Comments { get; set; }
        public virtual DbSet<Conversation> Conversations { get; set; }
        public virtual DbSet<ConversationMember> ConversationMembers { get; set; }
        public virtual DbSet<Follow> Follows { get; set; }
        public virtual DbSet<Like> Likes { get; set; }
        public virtual DbSet<CommentLike> CommentLikes { get; set; }
        public virtual DbSet<Message> Messages { get; set; }
        public virtual DbSet<Notification> Notifications { get; set; }
        public virtual DbSet<Post> Posts { get; set; }
        public virtual DbSet<PostMedia> PostMedias { get; set; }
        public virtual DbSet<FriendRelation> FriendRelations { get; set ; }

        static ApplicationDbContext()
        {
            AppContext.SetSwitch("Npgsql.EnableLegacyTimestampBehavior", true);
        }
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
        {

        }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            base.OnConfiguring(optionsBuilder);

            optionsBuilder.ConfigureWarnings(warnings => warnings
            .Ignore(InMemoryEventId.TransactionIgnoredWarning));
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            foreach (var mutableEntityType in modelBuilder.Model.GetEntityTypes())
            {
                var tableName = mutableEntityType.GetTableName();
                if (tableName != null && tableName.StartsWith("AspNet"))
                {
                    mutableEntityType.SetTableName(tableName.Substring(6).ToLowerInvariant());
                }
            }

            modelBuilder
                .HasPostgresEnum("MediaType", new[] { "IMAGE", "VIDEO" })
                .HasPostgresEnum("NotificationType", new[] { "LIKE", "FOLLOW", "COMMENT" });

            modelBuilder.Entity<Bookmark>(entity =>
            {
                entity.HasKey(e => e.Id).HasName("bookmarks _pkey");

                entity.ToTable("bookmarks ");

                entity.HasIndex(e => new { e.UserId, e.PostId }, "bookmarks _userId_postId_key").IsUnique();

                entity.Property(e => e.Id).HasColumnName("id");
                entity.Property(e => e.PostId).HasColumnName("postId");
                entity.Property(e => e.UserId).HasColumnName("userId");

                entity.HasOne(d => d.Post).WithMany(p => p.Bookmarks)
                    .HasForeignKey(d => d.PostId)
                    .HasConstraintName("bookmarks _postId_fkey");

                entity.HasOne(d => d.User).WithMany(p => p.Bookmarks)
                    .HasForeignKey(d => d.UserId)
                    .HasConstraintName("bookmarks _userId_fkey");
            });

            modelBuilder.Entity<Comment>(entity =>
            {
                entity.HasKey(e => e.Id).HasName("comments_pkey");

                entity.ToTable("comments");

                entity.Property(e => e.Id).HasColumnName("id");
                entity.Property(e => e.Content).HasColumnName("content");
                entity.Property(e => e.PostId).HasColumnName("postId");
                entity.Property(e => e.UserId).HasColumnName("userId");

                entity.HasOne(d => d.ParentComment).WithMany(p => p.ChildrenComment)
                    .HasForeignKey(d=>d.ParentId)
                    .OnDelete(DeleteBehavior.Cascade);

                entity.HasOne(d => d.Post).WithMany(p => p.Comments)
                    .HasForeignKey(d => d.PostId)
                    .HasConstraintName("comments_postId_fkey");

                entity.HasOne(d => d.User).WithMany(p => p.Comments)
                    .HasForeignKey(d => d.UserId)
                    .HasConstraintName("comments_userId_fkey");
            });

            modelBuilder.Entity<Conversation>(entity =>
            {
                entity.HasKey(e => e.Id).HasName("conversations_pkey");

                entity.ToTable("conversations");

                entity.Property(e => e.Id).HasColumnName("id");
                entity.Property(e => e.IsGroup)
                    .HasDefaultValue(false)
                    .HasColumnName("isGroup");
                entity.Property(e => e.Title).HasColumnName("title");

                entity.HasMany(x => x.ConversationMembers).WithOne(x => x.Conversation)
                    .HasForeignKey(x => x.ConversationId).OnDelete(DeleteBehavior.Cascade);
                entity.HasMany(x => x.Messages).WithOne(x => x.Conversation).HasForeignKey(x => x.ConversationId)
                    .OnDelete(DeleteBehavior.Cascade);
            });

            modelBuilder.Entity<ConversationMember>(entity =>
            {
                entity.HasKey(e => e.Id).HasName("conversationMember_pkey");

                entity.ToTable("conversationMember");

                entity.Property(e => e.Id).HasColumnName("id");
                entity.Property(e => e.ConversationId).HasColumnName("conversationId");
                entity.Property(e => e.UserId).HasColumnName("userId");
                entity.Property(e => e.LastDeleted)
                    .HasColumnType("timestamp(3) without time zone")
                    .HasColumnName("lastDeleted");

                entity.HasOne(d => d.Conversation).WithMany(p => p.ConversationMembers)
                    .HasForeignKey(d => d.ConversationId)
                    .HasConstraintName("conversationMember_conversationId_fkey");

                entity.HasOne(d => d.User).WithMany(p => p.ConversationMembers)
                    .HasForeignKey(d => d.UserId)
                    .HasConstraintName("conversationMember_userId_fkey");
            });

            modelBuilder.Entity<Follow>(entity =>
            {
                entity
                    .HasKey(e => e.Id);
                entity.ToTable("follows");

                entity.HasIndex(e => new { e.FollowerId, e.FollowingId }, "follows_followerId_followingId_key").IsUnique();

                entity.Property(e => e.Id).HasColumnName("id");
                entity.Property(e => e.FollowerId).HasColumnName("followerId");
                entity.Property(e => e.FollowingId).HasColumnName("followingId");

                entity.HasOne(d => d.Follower).WithMany(p => p.Followings)
                    .HasForeignKey(d => d.FollowerId)
                    .HasConstraintName("follows_followerId_fkey");

                entity.HasOne(d => d.Following).WithMany(p => p.Followers)
                    .HasForeignKey(d => d.FollowingId)
                    .HasConstraintName("follows_followingId_fkey");
            });

            modelBuilder.Entity<FriendRelation>(entity =>
            {
                entity.HasKey(e => e.Id).HasName("friend_relations_pkey");

                entity.ToTable("friend_relations");

                entity.HasIndex(e => new { e.SenderId, e.ReceiverId }, "friend_relations_senderId_receiverId_key").IsUnique();

                entity.Property(e => e.Id).HasColumnName("id");
                entity.Property(e => e.Accepted)
                    .HasDefaultValue(false)
                    .HasColumnName("accepted");
                entity.Property(e => e.ReceiverId).HasColumnName("receiverId");
                entity.Property(e => e.SenderId).HasColumnName("senderId");

                entity.HasOne(d => d.Receiver).WithMany(p => p.FriendRelationReceivers)
                    .HasForeignKey(d => d.ReceiverId)
                    .HasConstraintName("friend_relations_receiverId_fkey");

                entity.HasOne(d => d.Sender).WithMany(p => p.FriendRelationSenders)
                    .HasForeignKey(d => d.SenderId)
                    .HasConstraintName("friend_relations_senderId_fkey");
            });

            modelBuilder.Entity<Like>(entity =>
            {
                entity
                    .HasKey(x => new { x.PostId, x.UserId });
                entity.ToTable("likes ");

                entity.HasIndex(e => new { e.UserId, e.PostId }, "likes _userId_postId_key").IsUnique();

                entity.Property(e => e.PostId).HasColumnName("postId");
                entity.Property(e => e.UserId).HasColumnName("userId");

                entity.HasOne(d => d.Post).WithMany(x => x.Likes)
                    .HasForeignKey(d => d.PostId)
                    .HasConstraintName("likes _postId_fkey");

                entity.HasOne(d => d.User).WithMany()
                    .HasForeignKey(d => d.UserId)
                    .HasConstraintName("likes _userId_fkey");
            });

            modelBuilder.Entity<CommentLike>(entity => {
                entity.HasKey(x => new { x.CommentId,x.UserId});
                entity.ToTable("comment_likes");
                entity.HasIndex(e => new { e.UserId, e.CommentId }, "likes _userId_commentId_key").IsUnique();

                entity.Property(e => e.CommentId).HasColumnName("commentId");
                entity.Property(e => e.UserId).HasColumnName("userId");

                entity.HasOne(d => d.Comment).WithMany(x => x.CommentLikes)
                    .HasForeignKey(d => d.CommentId)
                    .HasConstraintName("likes _commentId_fkey");

                entity.HasOne(d => d.User).WithMany()
                    .HasForeignKey(d => d.UserId)
                    .HasConstraintName("likes _userId_fkey");
            });

            modelBuilder.Entity<Message>(entity =>
            {
                entity.HasKey(e => e.Id).HasName("message_pkey");

                entity.ToTable("messages");

                entity.Property(e => e.Id).HasColumnName("id");
                entity.Property(e => e.Content).HasColumnName("content");
                entity.Property(e => e.ConversationId).HasColumnName("conversationId");
                entity.Property(e => e.ReceiverId).HasColumnName("receiverId");
                entity.Property(e => e.Seen).HasColumnName("seen");
                entity.Property(e => e.SenderId).HasColumnName("senderId");

                entity.HasOne(d => d.Conversation).WithMany(p => p.Messages)
                    .HasForeignKey(d => d.ConversationId)
                    .OnDelete(DeleteBehavior.Cascade)
                    .HasConstraintName("message_conversationId_fkey");
            });

            modelBuilder.Entity<Notification>(entity =>
            {
                entity.HasKey(e => e.Id).HasName("notifications_pkey");

                entity.ToTable("notifications");

                entity.Property(e => e.Id).HasColumnName("id");
                entity.Property(e => e.IssuerId).HasColumnName("issuerId");
                entity.Property(e => e.PostId).HasColumnName("postId");
                entity.Property(e => e.RecipientId).HasColumnName("recipientId");
                entity.Property(e => e.Seen)
                    .HasDefaultValue(false)
                    .HasColumnName("seen");

                entity.HasOne(d => d.Issuer).WithMany(p => p.NotificationIssuers)
                    .HasForeignKey(d => d.IssuerId)
                    .OnDelete(DeleteBehavior.Cascade)
                    .HasConstraintName("notifications_issuerId_fkey");

                entity.HasOne(d => d.Post).WithMany(p => p.Notifications)
                    .HasForeignKey(d => d.PostId)
                    .OnDelete(DeleteBehavior.SetNull)
                    .HasConstraintName("notifications_postId_fkey");

                entity.HasOne(d => d.Comment).WithMany(p => p.Notifications)
                    .HasForeignKey(d => d.CommentId)
                    .OnDelete(DeleteBehavior.SetNull)
                    .HasConstraintName("notifications_commentId_fkey");
                entity.HasOne(d => d.Recipient).WithMany(p => p.NotificationRecipients)
                    .HasForeignKey(d => d.RecipientId)
                    .HasConstraintName("notifications_recipientId_fkey");
            });

            modelBuilder.Entity<Post>(entity =>
            {
                entity.HasKey(e => e.Id).HasName("posts_pkey");

                entity.ToTable("posts");

                entity.Property(e => e.Id).HasColumnName("id");
                entity.Property(e => e.Content).HasColumnName("content");
                entity.Property(e => e.UserId).HasColumnName("userId");

                entity.HasOne(d => d.User).WithMany(p => p.Posts)
                    .HasForeignKey(d => d.UserId)
                    .HasConstraintName("posts_userId_fkey");
            });

            modelBuilder.Entity<PostMedia>(entity =>
            {
                entity.HasKey(e => e.Id).HasName("post_media_pkey");

                entity.ToTable("post_media");

                entity.Property(e => e.Id).HasColumnName("id");
                entity.Property(e => e.PostId).HasColumnName("postId");
                entity.Property(e => e.Url).HasColumnName("url");

                entity.HasOne(d => d.Post).WithMany(p => p.Attachments)
                    .HasForeignKey(d => d.PostId)
                    .OnDelete(DeleteBehavior.SetNull)
                    .HasConstraintName("post_media_postId_fkey");
            });

            modelBuilder.Entity<User>(entity =>
            {
                entity.HasKey(e => e.Id).HasName("users_pkey");

                entity.ToTable("users");

                entity.HasIndex(e => e.NormalizedEmail, "users_email_key").IsUnique();
                entity.HasIndex(e => e.NormalizedUserName, "user_username_key").IsUnique();

                entity.Property(e => e.UsernameLastChange)
                    .HasColumnType("timestamp(3) without time zone");
            });
        }
    }
}