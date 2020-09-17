import React from 'react';
import {
  Header,
  PhaseBanner,
  Container,
  NavigationBar,
} from 'lbh-frontend-react';

const pageRedirect = [
  {
    name: 'Home',
    url: '/',
  },
  {
    name: 'Residents',
    url: 'https://beta.singleview.hackney.gov.uk',
  },
];

const Layout: React.FC = (props: any) => {
  const feedbackLink = process.env.FEEDBACK_LINK
    ? process.env.FEEDBACK_LINK
    : '';

  return (
    <div>
      <Header serviceName="Manage A Tenancy" />
      <Container>
        <PhaseBanner phase="BETA" url={feedbackLink} />
        <NavigationBar targets={pageRedirect} />
        {props.children}
      </Container>
    </div>
  );
};

export default Layout;
