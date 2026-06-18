using LibraryInventory.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace LibraryInventory.Infrastructure.Data.Configurations;

public class BookConfiguration : IEntityTypeConfiguration<Book>
{
    public void Configure(EntityTypeBuilder<Book> builder)
    {
        builder.ToTable("books");
        builder.HasKey(b => b.Id);
        builder.Property(b => b.Id).HasColumnName("id");
        builder.Property(b => b.Title).HasColumnName("title").HasMaxLength(200).IsRequired();
        builder.Property(b => b.Author).HasColumnName("author").HasMaxLength(150).IsRequired();
        builder.Property(b => b.CategoryId).HasColumnName("category_id");
        builder.Property(b => b.Genre).HasColumnName("genre").HasMaxLength(100).IsRequired();
        builder.Property(b => b.Isbn).HasColumnName("isbn").HasMaxLength(20).IsRequired();
        builder.HasIndex(b => b.Isbn).IsUnique();
        builder.Property(b => b.PublicationYear).HasColumnName("publication_year");
        builder.Property(b => b.Quantity).HasColumnName("quantity").HasDefaultValue(0);
        builder.Property(b => b.CreatedAt).HasColumnName("created_at");

        builder.HasOne(b => b.Category)
            .WithMany(c => c.Books)
            .HasForeignKey(b => b.CategoryId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}
