using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;
using System.IO;
using MetadataExtractor.Formats.Exif;
using MetadataExtractor.Formats.Iptc;
using MetadataExtractor.Formats.Jpeg;


namespace WindowsFormsApp2
{
    public partial class Form1 : Form
    {
        public Form1()
        {
            InitializeComponent();
        }

        private void button1_Click(object sender, EventArgs e)
        {

            // moves real photos (exif contains "Lens Make") tp the realDir and all other pictures to the fakeDir
            DirectoryInfo sourceDir = new DirectoryInfo(@"D:\Archives\photos\unsorted\bllondis@gmail.com's iCloud Photos\All Photos");
            DirectoryInfo realDir = new DirectoryInfo(@"D:\Archives\photos\unsorted\bllondis@gmail.com's iCloud Photos\Real");
            DirectoryInfo fakeDir = new DirectoryInfo(@"D:\Archives\photos\unsorted\bllondis@gmail.com's iCloud Photos\Fake");

            DeepCopy(sourceDir, realDir, fakeDir);

        }

        public static void DeepCopy(DirectoryInfo source, DirectoryInfo real, DirectoryInfo fake)
        {
            foreach (FileInfo file in source.GetFiles("*.jpg"))
            {
                var readers = new IJpegSegmentMetadataReader[] { new ExifReader(), new IptcReader() };

                try 
                {
                    var directories = JpegMetadataReader.ReadMetadata(file.FullName, readers);
                    var directory = directories.OfType<ExifSubIfdDirectory>().FirstOrDefault();
                    bool realPhoto = false;
                    if (directory != null)
                    {
                        foreach (var tag in directory.Tags)
                        {
                            if (tag.Name == "Lens Make")
                            {
                                realPhoto = true;
                            }
                        }
                    }

                    if (realPhoto)
                    {
                        file.CopyTo(Path.Combine(real.FullName, file.Name));
                    }
                    else
                    {
                        file.CopyTo(Path.Combine(fake.FullName, file.Name));
                    }

                }
                catch
                {

                }


            }

        }

        private void button2_Click(object sender, EventArgs e)
        {
            // replaces two spaces in the dir name with one space
            var directories = Directory.GetDirectories(@"D:\Archives\photoalbum");
            foreach (var directory in directories)
            {
                if (directory.Contains("  "))
                    {
                       //string NewPath = directory.Replace("  ", " ");
                      MessageBox.Show(directory);

                    //Directory.Move(directory, NewPath);


                }
            }
        }
    }
}
