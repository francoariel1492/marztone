/**
 * MarzTone by Manuel Robles Urquiza — Seed inicial.
 *
 * ⚠️  DATOS A REEMPLAZAR POR EL PROPIETARIO (marcados con REEMPLAZAR):
 *  - Logo / Favicon / OG image
 *  - Fotografías (instrumentos, artistas, taller, testimonios)
 *  - Biografía real de Manuel Robles Urquiza
 *  - Email, teléfono, WhatsApp, dirección, horarios
 *  - Instagram, YouTube, Spotify
 *  - Instrumentos, artistas y testimonios reales
 */
import { PrismaClient, InstrumentStatus, Language } from '@prisma/client';
import * as argon2 from 'argon2';

const prisma = new PrismaClient();

// Fotos de presentación (Unsplash, verificadas). REEMPLAZAR por fotos reales de MarzTone.
const IMG = (id: string, w = 1200) =>
  `https://images.unsplash.com/photo-${id}?w=${w}&q=80&auto=format&fit=crop`;

const PHOTOS = {
  hero: IMG('1558098329-a11cff621064', 1600),
  about: IMG('1598488035139-bdbb2231ce04', 1200),
  og: IMG('1510915361894-db8b60106cb1', 1200),
  workshop: [
    '1558098329-a11cff621064',
    '1572981779307-38b8cabb2407',
    '1504328345606-18bbc8c9d7d1',
    '1416339442236-8ceb164046f8',
    '1601058268499-e52658b8bb88',
    '1530124566582-a618bc2615dc',
  ].map((id) => IMG(id, 1000)),
  instruments: {
    signature: {
      main: IMG('1510915361894-db8b60106cb1'),
      gallery: ['1550985616-10810253b84d', '1516924962500-2b4b3b99ea02', '1525201548942-d8732f6617a0'].map((id) => IMG(id, 900)),
    },
    lowend: {
      main: IMG('1519892300165-cb5542fb47c7'),
      gallery: ['1512733596533-7b00ccf8ebaf', '1466428996289-fb355538da1b', '1493225457124-a3eb161ffa5f'].map((id) => IMG(id, 900)),
    },
    arte: {
      main: IMG('1564186763535-ebb21ef5277f'),
      gallery: ['1471478331149-c72f17e33c73', '1550985616-10810253b84d', '1516924962500-2b4b3b99ea02'].map((id) => IMG(id, 900)),
    },
  },
  artists: [
    IMG('1493225457124-a3eb161ffa5f', 800),
    IMG('1445985543470-41fba5c3144a', 800),
    IMG('1466428996289-fb355538da1b', 800),
  ],
  testimonials: [
    IMG('1519892300165-cb5542fb47c7', 300),
    IMG('1512733596533-7b00ccf8ebaf', 300),
    IMG('1525201548942-d8732f6617a0', 300),
  ],
};

async function main() {
  const adminEmail = process.env.ADMIN_EMAIL ?? 'admin@marztone.com';
  const adminPassword = process.env.ADMIN_INITIAL_PASSWORD ?? 'ChangeMe123!';

  // ---------------------------------------------------------------- Admin user
  const passwordHash = await argon2.hash(adminPassword);
  await prisma.adminUser.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      email: adminEmail,
      passwordHash,
      firstName: 'Manuel',
      lastName: 'Robles Urquiza',
      role: 'ADMIN',
      isActive: true,
    },
  });
  console.log(`✔ Admin: ${adminEmail}`);

  // ------------------------------------------------------------- Site settings
  const existingSettings = await prisma.siteSettings.findFirst();
  if (!existingSettings) {
    await prisma.siteSettings.create({
      data: {
        siteName: 'MarzTone',
        signature: 'by Manuel Robles Urquiza',
        sloganEs: 'Instrumentos con identidad propia',
        sloganEn: 'Instruments with a voice of their own',
        logoUrl: null, // REEMPLAZAR: logo definitivo
        faviconUrl: null, // REEMPLAZAR: favicon
        email: 'Manuroblesurquiza@gmail.com',
        phone: '+54 9 11 6799-9713',
        whatsappNumber: '5491167999713',
        whatsappMessageEs: 'Hola, vi la web de MarzTone y me gustaría hacer una consulta.',
        whatsappMessageEn: 'Hi, I saw the MarzTone website and I would like to make an inquiry.',
        instagramUrl: 'https://www.instagram.com/marztoneguitars/',
        youtubeUrl: 'https://youtube.com/', // REEMPLAZAR
        spotifyUrl: null, // REEMPLAZAR (opcional)
        addressEs: 'Calle del Taller 1, Ciudad, España', // REEMPLAZAR
        addressEn: 'Workshop Street 1, City, Spain', // REEMPLAZAR
        openingHoursEs: 'Lunes a viernes de 10:00 a 19:00 h', // REEMPLAZAR
        openingHoursEn: 'Monday to Friday, 10:00 to 19:00', // REEMPLAZAR
        mapEmbedUrl: null,
        seoTitleEs: 'MarzTone | Luthería artesanal by Manuel Robles Urquiza',
        seoTitleEn: 'MarzTone | Custom Luthier Workshop by Manuel Robles Urquiza',
        seoDescriptionEs:
          'MarzTone es un taller de luthería de Manuel Robles Urquiza especializado en instrumentos personalizados, reparaciones, restauraciones y calibraciones.',
        seoDescriptionEn:
          "MarzTone is Manuel Robles Urquiza's luthier workshop, specializing in custom instruments, repairs, restorations and professional setups.",
        ogImageUrl: PHOTOS.og,
        fontHeading: 'Cormorant Garamond',
        fontBody: 'Inter',
        colorTheme: 'cobre',
      },
    });
    console.log('✔ SiteSettings');
  }

  // ------------------------------------------------------------- Page sections
  const sections = [
    {
      key: 'hero',
      label: 'Portada',
      layout: 'imagen-fondo',
      titleEs: 'MarzTone',
      titleEn: 'MarzTone',
      subtitleEs: 'Instrumentos con identidad propia',
      subtitleEn: 'Instruments with a voice of their own',
      contentEs:
        'Diseñamos, construimos y restauramos instrumentos pensados para acompañar la identidad y el sonido de cada músico.',
      contentEn:
        'We design, build and restore instruments created to complement the identity and sound of every musician.',
      imageUrl: PHOTOS.hero,
      displayOrder: 0,
    },
    {
      key: 'about',
      label: 'Sobre nosotros',
      layout: 'imagen-derecha',
      titleEs: 'Quiénes somos',
      titleEn: 'About us',
      subtitleEs: 'Manuel Robles Urquiza',
      subtitleEn: 'Manuel Robles Urquiza',
      contentEs:
        'MarzTone nace de la pasión por la música y la madera. Cada instrumento se crea, adapta o ajusta según las necesidades, el estilo y la personalidad del músico.', // REEMPLAZAR: historia real
      contentEn:
        'MarzTone was born out of a passion for music and wood. Each instrument is created, adapted or set up according to the needs, style and personality of the musician.', // REEMPLAZAR
      imageUrl: PHOTOS.about,
      displayOrder: 1,
    },
    {
      key: 'workshop',
      label: 'El taller',
      layout: 'texto-centrado',
      titleEs: 'El taller',
      titleEn: 'The workshop',
      subtitleEs: 'Del diseño a la entrega',
      subtitleEn: 'From design to delivery',
      contentEs:
        'Un espacio donde la madera, las herramientas y la electrónica se combinan con paciencia artesanal.',
      contentEn: 'A space where wood, tools and electronics combine with patient craftsmanship.',
      displayOrder: 2,
    },
    {
      key: 'instruments',
      label: 'Instrumentos',
      layout: 'texto-centrado',
      titleEs: 'Instrumentos',
      titleEn: 'Instruments',
      subtitleEs: 'Nuestro trabajo',
      subtitleEn: 'Our work',
      displayOrder: 3,
    },
    {
      key: 'artists',
      label: 'Artistas',
      layout: 'texto-centrado',
      titleEs: 'Artistas',
      titleEn: 'Artists',
      subtitleEs: 'Confían en MarzTone',
      subtitleEn: 'They trust MarzTone',
      displayOrder: 4,
    },
    {
      key: 'contact',
      label: 'Contacto',
      layout: 'texto-centrado',
      titleEs: 'Contacto',
      titleEn: 'Contact',
      subtitleEs: 'Hablemos de tu próximo instrumento',
      subtitleEn: "Let's talk about your next instrument",
      contentEs: 'Escribinos y te asesoramos sin compromiso.',
      contentEn: 'Get in touch and we will advise you with no obligation.',
      displayOrder: 5,
    },
  ];
  for (const s of sections) {
    await prisma.pageSection.upsert({ where: { key: s.key }, update: {}, create: s });
  }
  console.log(`✔ PageSections (${sections.length})`);

  // ------------------------------------------------------------ Workshop images
  const workshopCount = await prisma.workshopImage.count();
  if (workshopCount === 0) {
    const workshopImages = [
      ['Herramientas de luthería', 'Luthier tools'],
      ['Selección de maderas', 'Wood selection'],
      ['Instrumento en construcción', 'Instrument under construction'],
      ['Electrónica y componentes', 'Electronics and components'],
      ['Acabados y terminaciones', 'Finishes'],
      ['Espacio de trabajo', 'Workspace'],
    ];
    await prisma.workshopImage.createMany({
      data: workshopImages.map(([es, en], i) => ({
        titleEs: es,
        titleEn: en,
        imageUrl: PHOTOS.workshop[i % PHOTOS.workshop.length],
        altEs: es,
        altEn: en,
        displayOrder: i,
      })),
    });
    console.log(`✔ WorkshopImages (${workshopImages.length})`);
  }

  // ----------------------------------------------------- Instrument categories
  const categories = [
    { slug: 'guitarras', nameEs: 'Guitarras', nameEn: 'Guitars', displayOrder: 0 },
    { slug: 'bajos', nameEs: 'Bajos', nameEn: 'Basses', displayOrder: 1 },
    { slug: 'personalizados', nameEs: 'Personalizados', nameEn: 'Custom', displayOrder: 2 },
    { slug: 'restauraciones', nameEs: 'Restauraciones', nameEn: 'Restorations', displayOrder: 3 },
    { slug: 'otros', nameEs: 'Otros', nameEn: 'Other', displayOrder: 4 },
  ];
  for (const c of categories) {
    await prisma.instrumentCategory.upsert({ where: { slug: c.slug }, update: {}, create: c });
  }
  console.log(`✔ InstrumentCategories (${categories.length})`);

  const guitarCat = await prisma.instrumentCategory.findUniqueOrThrow({
    where: { slug: 'guitarras' },
  });
  const bassCat = await prisma.instrumentCategory.findUniqueOrThrow({ where: { slug: 'bajos' } });
  const customCat = await prisma.instrumentCategory.findUniqueOrThrow({
    where: { slug: 'personalizados' },
  });

  // ---------------------------------------------------------------- Instruments
  const instrumentCount = await prisma.instrument.count();
  if (instrumentCount === 0) {
    const instruments = [
      {
        slug: 'guitarra-marztone-signature',
        nameEs: 'MarzTone Signature',
        nameEn: 'MarzTone Signature',
        descriptionEs:
          'Guitarra eléctrica artesanal construida a mano, pensada para músicos que buscan un sonido con carácter.', // REEMPLAZAR
        descriptionEn:
          'Handcrafted electric guitar, made for musicians looking for a sound with character.', // REEMPLAZAR
        materialsEs: 'Cuerpo de fresno, mástil de arce, diapasón de palo rosa.',
        materialsEn: 'Ash body, maple neck, rosewood fingerboard.',
        specificationsEs: '25.5" de escala, 22 trastes, pastillas humbucker artesanales.',
        specificationsEn: '25.5" scale, 22 frets, handmade humbucker pickups.',
        status: InstrumentStatus.AVAILABLE,
        price: '1800.00',
        currency: 'EUR',
        mainImageUrl: PHOTOS.instruments.signature.main,
        categoryId: guitarCat.id,
        isFeatured: true,
        displayOrder: 0,
      },
      {
        slug: 'bajo-marztone-lowend',
        nameEs: 'MarzTone LowEnd',
        nameEn: 'MarzTone LowEnd',
        descriptionEs: 'Bajo de 4 cuerdas con un low-end profundo y definido.', // REEMPLAZAR
        descriptionEn: 'Four-string bass with a deep and defined low-end.', // REEMPLAZAR
        materialsEs: 'Cuerpo de aliso, mástil de arce.',
        materialsEn: 'Alder body, maple neck.',
        specificationsEs: '34" de escala, 21 trastes, electrónica activa.',
        specificationsEn: '34" scale, 21 frets, active electronics.',
        status: InstrumentStatus.MADE_TO_ORDER,
        price: null,
        currency: 'EUR',
        mainImageUrl: PHOTOS.instruments.lowend.main,
        categoryId: bassCat.id,
        isFeatured: true,
        displayOrder: 1,
      },
      {
        slug: 'custom-marztone-arte',
        nameEs: 'MarzTone Arte',
        nameEn: 'MarzTone Arte',
        descriptionEs: 'Instrumento totalmente personalizado con acabados exclusivos.', // REEMPLAZAR
        descriptionEn: 'Fully customized instrument with exclusive finishes.', // REEMPLAZAR
        materialsEs: 'Maderas seleccionadas a elección del músico.',
        materialsEn: 'Selected woods chosen by the musician.',
        specificationsEs: 'Configuración a medida.',
        specificationsEn: 'Made-to-measure configuration.',
        status: InstrumentStatus.SOLD,
        price: null,
        currency: 'EUR',
        mainImageUrl: PHOTOS.instruments.arte.main,
        categoryId: customCat.id,
        isFeatured: false,
        displayOrder: 2,
      },
    ];
    const galleryBySlug: Record<string, string[]> = {
      'guitarra-marztone-signature': PHOTOS.instruments.signature.gallery,
      'bajo-marztone-lowend': PHOTOS.instruments.lowend.gallery,
      'custom-marztone-arte': PHOTOS.instruments.arte.gallery,
    };
    for (const inst of instruments) {
      const created = await prisma.instrument.create({ data: inst });
      const gallery = galleryBySlug[inst.slug] ?? [];
      await prisma.instrumentImage.createMany({
        data: gallery.map((url, i) => ({
          instrumentId: created.id,
          imageUrl: url,
          altEs: `${inst.nameEs} imagen ${i + 1}`,
          altEn: `${inst.nameEn} image ${i + 1}`,
          displayOrder: i,
        })),
      });
    }
    console.log(`✔ Instruments (${instruments.length})`);
  }

  // -------------------------------------------------------------------- Artists
  const artistCount = await prisma.artist.count();
  if (artistCount === 0) {
    const artists = [
      {
        slug: 'artista-uno',
        name: 'Artista Uno', // REEMPLAZAR
        stageName: 'Uno',
        biographyEs: 'Guitarrista profesional que confía en los instrumentos de MarzTone.', // REEMPLAZAR
        biographyEn: 'Professional guitarist who trusts MarzTone instruments.', // REEMPLAZAR
        instrumentUsedEs: 'MarzTone Signature',
        instrumentUsedEn: 'MarzTone Signature',
        imageUrl: PHOTOS.artists[0],
        instagramUrl: 'https://instagram.com/',
        isFeatured: true,
        displayOrder: 0,
      },
      {
        slug: 'artista-dos',
        name: 'Artista Dos', // REEMPLAZAR
        stageName: 'Dos',
        biographyEs: 'Bajista de sesión con un sonido inconfundible.', // REEMPLAZAR
        biographyEn: 'Session bassist with an unmistakable sound.', // REEMPLAZAR
        instrumentUsedEs: 'MarzTone LowEnd',
        instrumentUsedEn: 'MarzTone LowEnd',
        imageUrl: PHOTOS.artists[1],
        youtubeUrl: 'https://youtube.com/',
        isFeatured: true,
        displayOrder: 1,
      },
      {
        slug: 'artista-tres',
        name: 'Artista Tres', // REEMPLAZAR
        stageName: null,
        biographyEs: 'Compositora que colabora con el taller en instrumentos únicos.', // REEMPLAZAR
        biographyEn: 'Composer collaborating with the workshop on unique instruments.', // REEMPLAZAR
        instrumentUsedEs: 'MarzTone Arte',
        instrumentUsedEn: 'MarzTone Arte',
        imageUrl: PHOTOS.artists[2],
        spotifyUrl: 'https://open.spotify.com/',
        isFeatured: false,
        displayOrder: 2,
      },
    ];
    for (const a of artists) {
      await prisma.artist.create({ data: a });
    }
    console.log(`✔ Artists (${artists.length})`);
  }

  // ------------------------------------------------------------------- Services
  const services = [
    ['construccion', 'Construcción personalizada', 'Custom building', 'Guitar'],
    ['reparacion', 'Reparación', 'Repair', 'Wrench'],
    ['restauracion', 'Restauración', 'Restoration', 'Hammer'],
    ['calibracion', 'Calibración y puesta a punto', 'Setup & calibration', 'Sliders'],
    ['electronica', 'Cambio y ajuste de electrónica', 'Electronics upgrade', 'Zap'],
    ['personalizacion', 'Personalización', 'Customization', 'Palette'],
    ['mantenimiento', 'Mantenimiento', 'Maintenance', 'ShieldCheck'],
    ['asesoramiento', 'Asesoramiento', 'Consulting', 'MessageCircle'],
  ];
  for (let i = 0; i < services.length; i++) {
    const [slug, titleEs, titleEn, icon] = services[i];
    await prisma.service.upsert({
      where: { slug },
      update: {},
      create: {
        slug,
        titleEs,
        titleEn,
        descriptionEs: `${titleEs} de instrumentos con atención personalizada.`, // REEMPLAZAR
        descriptionEn: `${titleEn} of instruments with personalized attention.`, // REEMPLAZAR
        icon,
        isActive: true,
        displayOrder: i,
      },
    });
  }
  console.log(`✔ Services (${services.length})`);

  // --------------------------------------------------------------- Testimonials
  const testimonialCount = await prisma.testimonial.count();
  if (testimonialCount === 0) {
    const testimonials = [
      {
        customerName: 'Cliente Uno', // REEMPLAZAR
        relatedWorkEs: 'Guitarra personalizada',
        relatedWorkEn: 'Custom guitar',
        commentEs: 'El instrumento superó todas mis expectativas. Un trabajo impecable.', // REEMPLAZAR
        commentEn: 'The instrument exceeded all my expectations. Impeccable work.', // REEMPLAZAR
        customerImageUrl: PHOTOS.testimonials[0],
        displayOrder: 0,
      },
      {
        customerName: 'Cliente Dos', // REEMPLAZAR
        relatedWorkEs: 'Restauración',
        relatedWorkEn: 'Restoration',
        commentEs: 'Recuperaron mi bajo de toda la vida como si fuera nuevo.', // REEMPLAZAR
        commentEn: 'They restored my lifelong bass as if it were brand new.', // REEMPLAZAR
        customerImageUrl: PHOTOS.testimonials[1],
        displayOrder: 1,
      },
      {
        customerName: 'Cliente Tres', // REEMPLAZAR
        relatedWorkEs: 'Calibración',
        relatedWorkEn: 'Setup',
        commentEs: 'Atención cercana y un resultado profesional. Totalmente recomendable.', // REEMPLAZAR
        commentEn: 'Close attention and a professional result. Highly recommended.', // REEMPLAZAR
        customerImageUrl: PHOTOS.testimonials[2],
        displayOrder: 2,
      },
    ];
    await prisma.testimonial.createMany({ data: testimonials });
    console.log(`✔ Testimonials (${testimonials.length})`);
  }

  // ---------------------------------------------------- Ejemplo mensaje contacto
  const messageCount = await prisma.contactMessage.count();
  if (messageCount === 0) {
    await prisma.contactMessage.create({
      data: {
        name: 'Consulta de ejemplo',
        email: 'ejemplo@correo.com',
        inquiryType: 'general',
        subject: 'Bienvenido a MarzTone',
        message: 'Este es un mensaje de ejemplo generado por el seed.',
        language: Language.ES,
      },
    });
  }

  console.log('\n✅ Seed completado — MarzTone by Manuel Robles Urquiza');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
