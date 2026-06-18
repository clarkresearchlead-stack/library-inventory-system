using LibraryInventory.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace LibraryInventory.Infrastructure.Data.Configurations;

public class InventoryLogConfiguration : IEntityTypeConfiguration<InventoryLog>
{
    public void Configure(EntityTypeBuilder<InventoryLog> builder)
    {
        builder.ToTable("inventory_logs");
        builder.HasKey(l => l.Id);
        builder.Property(l => l.Id).HasColumnName("id");
        builder.Property(l => l.BookId).HasColumnName("book_id");
        builder.Property(l => l.TransactionType).HasColumnName("transaction_type").HasMaxLength(20).IsRequired();
        builder.Property(l => l.Quantity).HasColumnName("quantity");
        builder.Property(l => l.Remarks).HasColumnName("remarks").HasMaxLength(500).IsRequired();
        builder.Property(l => l.CreatedAt).HasColumnName("created_at");

        builder.HasOne(l => l.Book)
            .WithMany(b => b.InventoryLogs)
            .HasForeignKey(l => l.BookId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
