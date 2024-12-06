import Drive from "@/components/dashboard/Drive";
import NewHeader from "@/components/dashboard/NewHeader";


export default function DrivesPage() {
  const drives = [
    { title: 'TCS Drive 2025', img: '/tcs.png', date: "Oct. 16, 2024", last_date: "Oct. 30, 2024" },
    { title: 'Wipro Drive 2025', img: '/tcs.png', date: "Oct. 16, 2024", last_date: "Oct. 30, 2024" },
    { title: 'Infosys Drive 2025', img: '/tcs.png', date: "Oct. 16, 2024", last_date: "Oct. 30, 2024" },
    { title: 'Tech Mahindra Drive 2025', img: '/tcs.png', date: "Oct. 16, 2024", last_date: "Oct. 30, 2024" },
    { title: 'Accenture Drive 2025', img: '/tcs.png', date: "Oct. 16, 2024", last_date: "Oct. 30, 2024" },
  ]
  return (
    <div>
      <NewHeader title={"Drives"} link={'/drives/new'}/>
      <div className="px-16 grid grid-cols-4 gap-y-6">
        {drives.map((drive, i) => (
          <Drive key={i} title={drive.title} img={drive.img} date={drive.date} last_date={drive.last_date} />
        ))}
      </div>
    </div>
  )
}
