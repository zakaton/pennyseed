import { ExclamationIcon } from '@heroicons/react/solid';
import { useState, useEffect } from 'react';
import { useUser } from '../../context/user-context';
import MyLink from '../MyLink';

const warnings = {
  notSignedIn: () => (
    <span>
      You must be{' '}
      <MyLink href="/sign-in">
        <button type="button" className="font-medium underline">
          signed in
        </button>
      </MyLink>{' '}
      to create a campaign.
    </span>
  ),
  cantCreateCampaigns: () => (
    <span>
      You need to{' '}
      <MyLink
        href="/api/account/stripe-onboarding"
        target="_blank"
        rel="noreferrer"
      >
        <button type="button" className="font-medium underline">
          setup your Stripe Account
        </button>
      </MyLink>{' '}
      before you can create campaigns. Go to the{' '}
      <MyLink href="/account#">
        <button type="button" className="font-medium underline">
          General tab
        </button>
      </MyLink>{' '}
      on the{' '}
      <MyLink href="/account#">
        <button type="button" className="font-medium underline">
          Account page
        </button>
      </MyLink>{' '}
      .
    </span>
  ),
  hasActiveCampaign: ({ activeCampaignId }) => (
    <span>
      You already have an{' '}
      <MyLink href={`/campaign/${activeCampaignId}`}>
        <button type="button" className="font-medium underline">
          active campaign
        </button>
      </MyLink>
      . You must wait for it to finish or cancel it before you can create
      another.
    </span>
  ),
};

export default function CreateCampaignWarningBanner({ isCreatingCampaign }) {
  const { isLoading, user } = useUser();
  const [warning, setWarning] = useState(null);

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        setWarning('notSignedIn');
      } else if (!user.can_create_campaigns) {
        setWarning('cantCreateCampaigns');
      } else if (user.active_campaign) {
        setWarning('hasActiveCampaign');
      } else {
        setWarning(null);
      }
    }
  }, [isLoading, user]);

  const Warning = warning && warnings[warning];

  return (
    warning &&
    !isCreatingCampaign && (
      <div className="mb-2 rounded-md bg-red-50 p-4">
        <div className="flex justify-center">
          <div className="flex-shrink-0">
            <ExclamationIcon
              className="h-5 w-5 text-red-400"
              aria-hidden="true"
            />
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">
              {Warning && <Warning activeCampaignId={user.active_campaign} />}
            </h3>
          </div>
        </div>
      </div>
    )
  );
}
