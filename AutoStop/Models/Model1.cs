namespace AutoStop.Models
{
    using System.Data.Entity;
    

    public partial class Model1 : DbContext
    {
        public Model1()
            : base("name=Model1")
        {
        }

        public virtual DbSet<Log> Logs { get; set; }
        public virtual DbSet<Part> Parts { get; set; }
        public virtual DbSet<Analog> Analogs { get; set; }
        public virtual DbSet<ContactUs> Contact { get; set; }

        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            
            modelBuilder.Entity<Log>()
                .Property(e => e.Message)
                .IsUnicode(false);

            modelBuilder.Entity<Log>()
                .Property(e => e.FileName)
                .IsUnicode(false);

            modelBuilder.Entity<Part>()
                .Property(e => e.Number)
                .IsUnicode(false);

            modelBuilder.Entity<Part>()
                .Property(e => e.Description)
                .IsUnicode(false);

            modelBuilder.Entity<Part>()
                .Property(e => e.Brand)
                .IsFixedLength();
        }
    }
}
