using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TeduEcommerce.Migrations
{
    /// <inheritdoc />
    public partial class update_name : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "CreategorySlug",
                table: "AppProducts",
                newName: "CategorySlug");

            migrationBuilder.RenameColumn(
                name: "CreategoryName",
                table: "AppProducts",
                newName: "CategoryName");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "CategorySlug",
                table: "AppProducts",
                newName: "CreategorySlug");

            migrationBuilder.RenameColumn(
                name: "CategoryName",
                table: "AppProducts",
                newName: "CreategoryName");
        }
    }
}
