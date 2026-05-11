import Navbar    from '../components/layout/Navbar'
import Cover     from '../components/sections/Cover'
import About     from '../components/sections/About'
import Skills    from '../components/sections/Skills'
import Journey   from '../components/sections/Journey'
import Projects  from '../components/sections/Projects'
import Extras    from '../components/sections/Extras'
import Contact   from '../components/sections/Contact'

import { useSupabaseSingle, useSupabaseTable } from '../hooks/useSupabase'
import {
  FALLBACK_PROFILE,
  FALLBACK_SKILLS,
  FALLBACK_JOURNEY,
  FALLBACK_PROJECTS,
  FALLBACK_AWARDS,
  FALLBACK_CERTIFICATIONS,
} from '../lib/fallbackData'

export default function Portfolio() {
  const { data: profile  } = useSupabaseSingle('profile',          FALLBACK_PROFILE)
  const { data: skills   } = useSupabaseTable('skills',            { fallbackData: FALLBACK_SKILLS   })
  const { data: journey  } = useSupabaseTable('journey',           { fallbackData: FALLBACK_JOURNEY  })
  const { data: projects } = useSupabaseTable('projects',          { fallbackData: FALLBACK_PROJECTS })
  const { data: awards   } = useSupabaseTable('awards',            { fallbackData: FALLBACK_AWARDS, orderBy: 'year' })
  const { data: certs    } = useSupabaseTable('certifications',    { fallbackData: FALLBACK_CERTIFICATIONS, orderBy: 'year' })

  return (
    <>
      <Navbar />
      <main>
        <Cover    profile={profile}                                      />
        <About    profile={profile}                                      />
        <Skills   skills={skills}                                        />
        <Journey  journey={journey}                                      />
        <Projects projects={projects}                                    />
        <Extras   awards={awards}        certifications={certs}          />
        <Contact  profile={profile}                                      />
      </main>
    </>
  )
}
