using System;
using System.Collections.Generic;
using System.Collections.Immutable;
using System.IO;
using System.Linq;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;

namespace GoogleHashCode2020
{
    class Program
    {
        private static int _daysRemaining = 0;
        private static List<int> _alreadyScanned = new List<int>();
        private static Dictionary<int, int> _bookScores; 

        static InputData ReadInputData(string fileName)
        {
            InputData result = new InputData();
            var contentRows = File.ReadAllLines(fileName);

            var firstLineValues = contentRows[0].Split(' ');
            result.DayCount = Convert.ToInt32(firstLineValues[2]);

            result.BookScores = contentRows[1].Split(' ')
                .Select((v, i) => new { Key = i, Value = Convert.ToInt32(v) })
                .ToDictionary(o => o.Key, o => o.Value);

            int currentLibraryId = 0;
            result.Libraries = new List<Library>();

            for (int i=0; i< Convert.ToInt32(firstLineValues[1])*2; i=i+2)
            {
                var libraryDetails = contentRows[i + 2].Split(' ');
                int[] bookIds = Array.ConvertAll<string,int>(contentRows[i + 3].Split(' '), input => Convert.ToInt32(input));
                Library currentLibrary = new Library()
                {
                    Id = currentLibraryId++,
                    BookCount = Convert.ToInt32(libraryDetails[0]),
                    SignupDuration = Convert.ToInt32(libraryDetails[1]),
                    ShippableBookCount = Convert.ToInt32(libraryDetails[2]),
                    BookIds = bookIds,
                };
                result.Libraries.Add(currentLibrary);
            }

            return result;
        }

        static LibraryResult ComputeLibraryPotential(Library library)
        {
            // var watch = System.Diagnostics.Stopwatch.StartNew();
            LibraryResult result = new LibraryResult() { Library = library};

            int productiveDays = _daysRemaining - library.SignupDuration;
            if (productiveDays <= 0)
            {
                result.ScoreYield = 0;
                
                return result;
            };

            int[] notScannedBookIds = library.BookIds.Except(_alreadyScanned).ToArray();
            int maxBookYield = Math.Min((productiveDays * library.ShippableBookCount), notScannedBookIds.Length);

            IEnumerable<KeyValuePair<int, int>> chosenBooksWithScores = notScannedBookIds
                // .AsParallel()
                .Select(i => new KeyValuePair<int,int>(i,_bookScores[i]))
                .OrderByDescending(pair => pair.Value)
                // .AsSequential()
                .Take(maxBookYield);

            // IEnumerable<KeyValuePair<int, int>> chosenBooksWithScores = _bookScores
            //     .Where(bookScore => notScannedBookIds.Contains(bookScore.Key))
            //     .OrderByDescending(pair => pair.Value)
            //     .Take(maxBookYield);

            result.ScoreYield = chosenBooksWithScores.Sum(pair => pair.Value);
            result.BookIdSequence = chosenBooksWithScores.Select(pair => pair.Key);


            // watch.Stop();
            // var elapsedMs = watch.ElapsedMilliseconds;
            // DateTime stop = DateTime.Now;

            // TimeSpan timeSpan = stop - start;
            // Console.WriteLine("Duration for ComputeLibraryPotential: " + new TimeSpan(watch.ElapsedTicks));
            // Console.WriteLine("Computed library " + library.Id + ". Score: " + result.ScoreYield);
            return result;
        }

        static LibraryResult GetNextBestLibrary(IEnumerable<Library> availableLibraries)
        {
            var watch = System.Diagnostics.Stopwatch.StartNew();

            LibraryResult mostProfitableLibrary = availableLibraries.AsParallel()
                .Select(ComputeLibraryPotential)
                .OrderByDescending(libraryResult => libraryResult?.ScoreYield)
                .FirstOrDefault();

            // ParallelLoopResult parallelLoopResult = Parallel.ForEach(availableLibraries, library => ComputeLibraryPotential(library));
            // availableLibraries.AsParallel().Select(ComputeLibraryPotential)
            //     .OrderByDescending(libraryResult => libraryResult.ScoreYield)
            //     .ToArray();

            watch.Stop();
            // var elapsedMs = watch.ElapsedMilliseconds;
            // Console.WriteLine("Duration for GetNextBestLibrary: " + elapsedMs);
            Console.WriteLine("Duration for GetNextBestLibrary: " + new TimeSpan(watch.ElapsedTicks) + " id:" + mostProfitableLibrary.Library.Id + " - score - " + mostProfitableLibrary.ScoreYield);
            return mostProfitableLibrary;
        }

        static void WriteOutput(string fileName, List<LibraryResult> chosenLibraryResults)
        {
            StringBuilder sb = new StringBuilder();

            sb.AppendLine(chosenLibraryResults.Count().ToString());
            chosenLibraryResults.ForEach(result =>
            {
                sb.AppendLine(result.Library.Id + " " + result.BookIdSequence.Count());
                sb.AppendLine(String.Join(' ', result.BookIdSequence));
            });

            File.WriteAllText(Path.Combine(".\\in\\",fileName), sb.ToString());
        }
        static void Main(string[] args)
        {
            Console.WriteLine("Hello World!");
            string fileA = ".\\in\\a_example.txt";
            string fileB = ".\\in\\b_read_on.txt";
            string fileC = ".\\in\\c_incunabula.txt";
            string fileD = ".\\in\\d_tough_choices.txt";
            string fileE = ".\\in\\e_so_many_books.txt";
            string fileF = ".\\in\\f_libraries_of_the_world.txt";
            
            // DutzuGreedy(fileA);
            // DutzuGreedy(fileB);
            // DutzuGreedy(fileC);
            DutzuGreedy(fileD);
            // DutzuGreedy(fileE);
            // DutzuGreedy(fileF);
        }

        private static void DutzuGreedy(string inputFileName)
        {
            Console.WriteLine("Processing file: " + inputFileName);
            InputData inputData = ReadInputData(inputFileName);
            Console.WriteLine("Finished reading input data. Received " + inputData.Libraries.Count + " libraries.");

            _daysRemaining = inputData.DayCount;
            _bookScores = inputData.BookScores;

            int currentScore = 0;
            List<LibraryResult> chosenLibraryResults = new List<LibraryResult>();

            LibraryResult x = GetNextBestLibrary(inputData.Libraries);

            while (true)
            {
                LibraryResult nextBestLibrary = GetNextBestLibrary(inputData.Libraries);
                if (nextBestLibrary == null) break;
                if (nextBestLibrary.ScoreYield == 0) break;
            
                chosenLibraryResults.Add(nextBestLibrary);
                inputData.Libraries.Remove(nextBestLibrary.Library);
            
                _alreadyScanned.AddRange(nextBestLibrary.BookIdSequence);
                currentScore += nextBestLibrary.ScoreYield;
                _daysRemaining -= nextBestLibrary.Library.SignupDuration;
            
                // Console.WriteLine("Next best library: " + nextBestLibrary.Library.Id + " - score: " +
                                  // nextBestLibrary.ScoreYield + ". Remaining days: " + _daysRemaining);
            }

            Console.WriteLine("Total Score: " + currentScore);

            WriteOutput("out_" + Path.GetFileName(inputFileName), chosenLibraryResults);
        }
    }

    public class Library
    {
        public int Id { get; set; }
        public int BookCount { get; set; }
        public int SignupDuration { get; set; }

        public int[] BookIds { get; set; }
        public int ShippableBookCount { get; set; }
    }

    public class InputData
    {
        public List<Library> Libraries { get; set; }
        public int DayCount { get; set; }
        public Dictionary<int, int> BookScores { get; set; }
    }

    public class LibraryResult
    {
        public Library Library { get; set; }
        public IEnumerable<int> BookIdSequence { get; set; }
        public int ScoreYield { get; set; }
    }
}
