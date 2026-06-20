import { useState } from 'react'
import Navbar     from '../components/layout/Navbar'
import Intro      from '../components/sections/Intro'
import Hero       from '../components/sections/Hero'
import Abilities  from '../components/sections/Abilities'
import Records    from '../components/sections/Records'
import Missions   from '../components/sections/Missions'
import Accolades  from '../components/sections/Accolades'
import Signal     from '../components/sections/Signal'

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
  const [entered, setEntered] = useState(false)

  const { data: profile  } = useSupabaseSingle('profile',       FALLBACK_PROFILE)
  const { data: skills   } = useSupabaseTable('skills',         { fallbackData: FALLBACK_SKILLS  })
  const { data: journey  } = useSupabaseTable('journey',        { fallbackData: FALLBACK_JOURNEY })
  const { data: projects } = useSupabaseTable('projects',       { fallbackData: FALLBACK_PROJECTS })
  const { data: awards   } = useSupabaseTable('awards',         { fallbackData: FALLBACK_AWARDS,          orderBy: 'year' })
  const { data: certs    } = useSupabaseTable('certifications', { fallbackData: FALLBACK_CERTIFICATIONS,  orderBy: 'year' })

  return (
    <>
      {/* Intro screen — rendered on top, removed when entered */}
      {!entered && <Intro onEnter={() => setEntered(true)} />}

      {/* Main site */}
      <Navbar />
      <main>
        <Hero       profile={profile}                              />
        <Abilities  skills={skills}                                />
        <Records    journey={journey}                              />
        <Missions   projects={projects}                            />
        <Accolades  awards={awards}   certifications={certs}       />
        <Signal     profile={profile}                              />
      </main>
    </>
  )
}
